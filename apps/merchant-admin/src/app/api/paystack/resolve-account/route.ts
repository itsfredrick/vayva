import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { accountNumber, bankCode } = await req.json();

        if (!accountNumber || !bankCode) {
            return NextResponse.json(
                { error: "Account number and bank code are required" },
                { status: 400 }
            );
        }

        // Use the provided Live Secret Key
        const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        if (!SECRET_KEY) {
            console.error("PAYSTACK_SECRET_KEY is missing");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const response = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${SECRET_KEY}`,
                },
            }
        );

        const data = await response.json();

        if (!data.status) {
            return NextResponse.json(
                { error: data.message || "Could not resolve account name" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            account_name: data.data.account_name,
            account_number: data.data.account_number,
            bank_id: data.data.bank_id
        });
    } catch (error) {
        console.error("Paystack resolve error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
