
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a standard font
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 20,
    },
    logoSection: {
        width: '40%',
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    companyDetails: {
        fontSize: 10,
        color: '#666',
        lineHeight: 1.4,
    },
    invoiceTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'right',
    },
    invoiceMeta: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    metaLabel: {
        fontSize: 10,
        color: '#666',
        width: 80,
        textAlign: 'right',
        marginRight: 10,
    },
    metaValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111',
        width: 100,
        textAlign: 'right',
    },

    // Client Section
    billTo: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 10,
        color: '#999',
        fontWeight: 'bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    clientName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    clientAddress: {
        fontSize: 10,
        color: '#666',
        lineHeight: 1.4,
    },

    // Table
    table: {
        width: '100%',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        padding: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        padding: 8,
    },
    colDesc: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '15%', textAlign: 'right' },
    colTotal: { width: '20%', textAlign: 'right' },

    headerText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#666',
        textTransform: 'uppercase',
    },
    rowText: {
        fontSize: 10,
        color: '#333',
    },

    // Totals
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    totalRow: {
        flexDirection: 'row',
        marginBottom: 6,
        justifyContent: 'flex-end',
    },
    totalLabel: {
        fontSize: 10,
        color: '#666',
        width: 100,
        textAlign: 'right',
        marginRight: 20,
    },
    totalValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111',
        width: 100,
        textAlign: 'right',
    },
    grandTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
        marginTop: 4,
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 9,
        textAlign: 'center',
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 20,
    },
});

interface InvoiceProps {
    data: {
        number: string;
        date: string;
        storeName: string;
        storeAddress: string;
        storeEmail: string;
        customerName: string;
        customerAddress: string;
        items: Array<{
            description: string;
            quantity: number;
            price: number;
        }>;
        subtotal: number;
        tax: number;
        total: number;
        brandColor?: string;
        footerNote?: string;
    }
}

export const InvoiceDocument = ({ data }: InvoiceProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoSection}>
                    <Text style={[styles.logoText, { color: data.brandColor || '#000' }]}>
                        {data.storeName.toUpperCase()}
                    </Text>
                    <Text style={styles.companyDetails}>{data.storeAddress}</Text>
                    <Text style={styles.companyDetails}>{data.storeEmail}</Text>
                </View>
                <View style={styles.invoiceMeta}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Invoice No:</Text>
                        <Text style={styles.metaValue}>{data.number}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaLabel}>Date:</Text>
                        <Text style={styles.metaValue}>{data.date}</Text>
                    </View>
                </View>
            </View>

            {/* Bill To */}
            <View style={styles.billTo}>
                <Text style={styles.sectionTitle}>Bill To:</Text>
                <Text style={styles.clientName}>{data.customerName}</Text>
                <Text style={styles.clientAddress}>{data.customerAddress}</Text>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.colDesc]}>Description</Text>
                <Text style={[styles.headerText, styles.colQty]}>Qty</Text>
                <Text style={[styles.headerText, styles.colPrice]}>Price</Text>
                <Text style={[styles.headerText, styles.colTotal]}>Amount</Text>
            </View>

            {/* Items */}
            {data.items.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={[styles.rowText, styles.colDesc]}>{item.description}</Text>
                    <Text style={[styles.rowText, styles.colQty]}>{item.quantity}</Text>
                    <Text style={[styles.rowText, styles.colPrice]}>₦{item.price.toLocaleString()}</Text>
                    <Text style={[styles.rowText, styles.colTotal]}>
                        ₦{(item.quantity * item.price).toLocaleString()}
                    </Text>
                </View>
            ))}

            {/* Totals */}
            <View style={styles.totalsSection}>
                <View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalValue}>₦{data.subtotal.toLocaleString()}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax (0%)</Text>
                        <Text style={styles.totalValue}>₦{data.tax.toLocaleString()}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { fontWeight: 'bold', color: '#000' }]}>Total Due</Text>
                        <Text style={[styles.totalValue, styles.grandTotal]}>₦{data.total.toLocaleString()}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                {data.footerNote || "Thank you for your business. Please make payment within 30 days."}
                {"\n"}
                Generated by Vayva.ng Pro
            </Text>

        </Page>
    </Document>
);
