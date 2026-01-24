import axios from "axios";
const YOUVERIFY_BASE_URL = process.env.YOUVERIFY_BASE_URL || "https://api.youverify.co";
const YOUVERIFY_API_KEY = process.env.YOUVERIFY_API_KEY || "YOUR_YOUVERIFY_TOKEN_HERE";
export class YouverifyService {
    /**
     * Verify Virtual NIN (vNIN)
     */
    static async verifyVNIN(id: any, validationData: any, selfieImage: any) {
        const payload: any = {
            id,
            isSubjectConsent: true,
        };
        if (validationData) {
            payload.validations = {
                data: validationData,
            };
        }
        if (selfieImage) {
            if (!payload.validations)
                payload.validations = {};
            payload.validations.selfie = {
                image: selfieImage,
            };
        }
        try {
            const response = await axios.post(`${YOUVERIFY_BASE_URL}/v2/api/identity/ng/vnin`, payload, {
                headers: {
                    token: YOUVERIFY_API_KEY,
                },
            });
            return response.data;
        }
        catch (error: any) {
            console.error("Youverify vNIN Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "vNIN verification failed");
        }
    }
    /**
     * Verify Bank Verification Number (BVN)
     */
    static async verifyBVN(id: any, validationData: any, selfieImage: any, premium = true) {
        const payload: any = {
            id,
            isSubjectConsent: true,
            premiumBVN: premium,
        };
        if (validationData) {
            payload.validations = {
                data: validationData,
            };
        }
        if (selfieImage) {
            if (!payload.validations)
                payload.validations = {};
            payload.validations.selfie = {
                image: selfieImage,
            };
        }
        try {
            const response = await axios.post(`${YOUVERIFY_BASE_URL}/v2/api/identity/ng/bvn`, payload, {
                headers: {
                    token: YOUVERIFY_API_KEY,
                },
            });
            return response.data;
        }
        catch (error: any) {
            console.error("Youverify BVN Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "BVN verification failed");
        }
    }
}
