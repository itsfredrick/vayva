import { cn } from "@/lib/utils";
import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

interface PromoEmailProps {
    storeName?: string;
    logoUrl?: string;
    headline?: string;
    bodyText?: string;
    ctaText?: string;
    ctaUrl?: string;
    brandColor?: string;
}

export const PromoEmail = ({
    storeName = "My Store",
    logoUrl,
    headline = "Big Savings Inside!",
    bodyText = "We are having a massive sale this weekend. Don't miss out on up to 50% off select items.",
    ctaText = "Shop Now",
    ctaUrl = "https://vayva.shop",
    brandColor = "#000000",
}: PromoEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>{headline} - {storeName}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        {logoUrl ? (
                            <Img
                                src={logoUrl}
                                width="40"
                                height="40"
                                alt={storeName}
                                className="my-0 mx-auto"
                            />
                        ) : (
                            <Heading className="text-center text-xl font-bold my-0 mx-auto p-0">
                                {storeName}
                            </Heading>
                        )}

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            {headline}
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello valued customer,
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            {bodyText}
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-4 py-3"
                                href={ctaUrl}
                                style={{ backgroundColor: brandColor }}
                            >
                                {ctaText}
                            </Button>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            See you at the store!
                            <br />
                            The {storeName} Team
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            You are receiving this email because you opted in to marketing from {storeName}.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

const Hr = ({ className }: { className?: string }) => (
    <hr className={cn("border border-solid border-[#eaeaea] my-[26px] mx-0 w-full", className)} />
);

export default PromoEmail;
