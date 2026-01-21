import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
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
export const InvoiceDocument = ({ data }) => (_jsx(Document, { children: _jsxs(Page, { size: "A4", style: styles.page, children: [_jsxs(View, { style: styles.header, children: [_jsxs(View, { style: styles.logoSection, children: [_jsx(Text, { style: [styles.logoText, { color: data.brandColor || '#000' }], children: data.storeName.toUpperCase() }), _jsx(Text, { style: styles.companyDetails, children: data.storeAddress }), _jsx(Text, { style: styles.companyDetails, children: data.storeEmail })] }), _jsxs(View, { style: styles.invoiceMeta, children: [_jsx(Text, { style: styles.invoiceTitle, children: "INVOICE" }), _jsxs(View, { style: styles.metaRow, children: [_jsx(Text, { style: styles.metaLabel, children: "Invoice No:" }), _jsx(Text, { style: styles.metaValue, children: data.number })] }), _jsxs(View, { style: styles.metaRow, children: [_jsx(Text, { style: styles.metaLabel, children: "Date:" }), _jsx(Text, { style: styles.metaValue, children: data.date })] })] })] }), _jsxs(View, { style: styles.billTo, children: [_jsx(Text, { style: styles.sectionTitle, children: "Bill To:" }), _jsx(Text, { style: styles.clientName, children: data.customerName }), _jsx(Text, { style: styles.clientAddress, children: data.customerAddress })] }), _jsxs(View, { style: styles.tableHeader, children: [_jsx(Text, { style: [styles.headerText, styles.colDesc], children: "Description" }), _jsx(Text, { style: [styles.headerText, styles.colQty], children: "Qty" }), _jsx(Text, { style: [styles.headerText, styles.colPrice], children: "Price" }), _jsx(Text, { style: [styles.headerText, styles.colTotal], children: "Amount" })] }), data.items.map((item, i) => (_jsxs(View, { style: styles.tableRow, children: [_jsx(Text, { style: [styles.rowText, styles.colDesc], children: item.description }), _jsx(Text, { style: [styles.rowText, styles.colQty], children: item.quantity }), _jsxs(Text, { style: [styles.rowText, styles.colPrice], children: ["\u20A6", item.price.toLocaleString()] }), _jsxs(Text, { style: [styles.rowText, styles.colTotal], children: ["\u20A6", (item.quantity * item.price).toLocaleString()] })] }, i))), _jsx(View, { style: styles.totalsSection, children: _jsxs(View, { children: [_jsxs(View, { style: styles.totalRow, children: [_jsx(Text, { style: styles.totalLabel, children: "Subtotal" }), _jsxs(Text, { style: styles.totalValue, children: ["\u20A6", data.subtotal.toLocaleString()] })] }), _jsxs(View, { style: styles.totalRow, children: [_jsx(Text, { style: styles.totalLabel, children: "Tax (0%)" }), _jsxs(Text, { style: styles.totalValue, children: ["\u20A6", data.tax.toLocaleString()] })] }), _jsxs(View, { style: styles.totalRow, children: [_jsx(Text, { style: [styles.totalLabel, { fontWeight: 'bold', color: '#000' }], children: "Total Due" }), _jsxs(Text, { style: [styles.totalValue, styles.grandTotal], children: ["\u20A6", data.total.toLocaleString()] })] })] }) }), _jsxs(Text, { style: styles.footer, children: [data.footerNote || "Thank you for your business. Please make payment within 30 days.", "\n", "Generated by Vayva.ng Pro"] })] }) }));
