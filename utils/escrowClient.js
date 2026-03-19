const useMock = process.env.USE_MOCK_ESCROW === 'true';

const mockEscrowService = {
    releaseFunds: async (transactionId, beneficiaryDetails) => {
        console.log(`🧪 MOCK: Releasing funds for transaction: ${transactionId}`);
        console.log('💰 Beneficiary:', beneficiaryDetails);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            id: transactionId,
            status: 'completed',
            released_amount: beneficiaryDetails.amount,
            beneficiary: {
                name: beneficiaryDetails.name,
                bank_account: beneficiaryDetails.bank_account,
                bank_name: beneficiaryDetails.bank_name
            },
            released_at: new Date().toISOString(),
            escrow_fee: beneficiaryDetails.amount * 0.005,
            net_amount: beneficiaryDetails.amount * 0.995,
            note: '🧪 Mock transaction - Funds released to ranch owner'
        };
    }
};

const realEscrowApprove = async (transactionId, beneficiaryDetails) => {
    try {
        const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
        const email = environment === 'production'
            ? process.env.ESCROW_PRODUCTION_EMAIL
            : process.env.ESCROW_SANDBOX_EMAIL;
        const apiKey = environment === 'production'
            ? process.env.ESCROW_PRODUCTION_API_KEY
            : process.env.ESCROW_SANDBOX_API_KEY;

        const baseURL = environment === 'production'
            ? 'https://api.escrow.com/2017-09-01'
            : 'https://api.escrow-sandbox.com/2017-09-01';

        const auth = Buffer.from(`${email}:${apiKey}`).toString('base64');

        console.log(`🚀 Calling Escrow API: ${baseURL}/transaction/${transactionId}/approve`);

        const response = await fetch(`${baseURL}/transaction/${transactionId}/approve`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'approve',
                beneficiary: {
                    bank_account: beneficiaryDetails.bank_account,
                    bank_routing: beneficiaryDetails.bank_routing,
                    name: beneficiaryDetails.name
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Escrow API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Escrow API Success:', result);
        return result;

    } catch (error) {
        console.error('❌ Escrow API Error:', error);
        throw error;
    }
};

export const releaseFundsToRanchOwner = async (purchaseData, bankDetails) => {
    try {
        console.log(`🏦 Releasing $${purchaseData.balance_amount} to: ${bankDetails.account_holder_name}`);
        const beneficiaryDetails = {
            bank_account: bankDetails.account_number,
            bank_routing: bankDetails.routing_number,
            name: bankDetails.account_holder_name,
            bank_name: bankDetails.bank_name,
            ifsc_code: bankDetails.ifsc_code,
            amount: purchaseData.balance_amount
        };
        console.log('💰 Beneficiary Details:', beneficiaryDetails);

        if (useMock) {
            console.log('🧪 Using Mock Escrow Service');
            const mockResult = await mockEscrowService.releaseFunds(
                purchaseData.escrow_transaction_id,
                beneficiaryDetails
            );
            return { success: true, escrow_response: mockResult, mode: 'mock' };
        } else {
            console.log('🚀 Using Real Escrow API');
            const escrowResponse = await realEscrowApprove(
                purchaseData.escrow_transaction_id,
                beneficiaryDetails
            );
            return {success: true,escrow_response: escrowResponse,mode: 'production'};
        }

    } catch (error) {
        console.error('❌ Error releasing funds to Escrow:', error);
        let errorMessage = error.message;
        if (error.response) {
            errorMessage = `Escrow API Error: ${error.response.status} - ${error.response.data}`;
        }
        return {
            success: false,
            error: errorMessage
        };
    }
};

export default {
    releaseFundsToRanchOwner
};