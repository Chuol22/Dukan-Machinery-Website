/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

export type QuotationPDFData = {
  quotationNumber: string;
  issueDate: string; // ISO
  validUntil: string; // ISO
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  machineName: string;
  machineQuantity: number;
  machineCost: number;
  shippingCost: number;
  installationCost: number;
  additionalCharges: number;
  totalCost: number;
  terms?: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logoWrap: {
    width: 80,
    height: 40,
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  },
  companyBlock: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
  },
  companyMeta: {
    marginTop: 2,
    fontSize: 9,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    color: '#f97316',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  grid2Col: {
    flex: 1,
  },
  table: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontWeight: 700,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tdLeft: {
    flex: 1,
  },
  tdRight: {
    width: 90,
    textAlign: 'right',
  },
  notes: {
    marginTop: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
  },
  signatureRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  sigBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
  },
  stamp: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 9999,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#6b7280',
  },
});

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' });
};

const fmtCost = (n: number) => {
  try {
    return `ETB ${Number(n).toLocaleString()}`;
  } catch {
    return `ETB ${n}`;
  }
};

export default function QuotationDocument({ data }: { data: QuotationPDFData }) {
  const {
    quotationNumber,
    issueDate,
    validUntil,
    customerName,
    customerCompany,
    customerEmail,
    machineName,
    machineQuantity,
    machineCost,
    shippingCost,
    installationCost,
    additionalCharges,
    totalCost,
    terms,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            {/* Static logo path from public; works in server-side render */}
            <Image src="/images/hero/dkmlogo.png" style={styles.logo} />
          </View>
          <View style={styles.companyBlock}>
            <Text style={styles.companyName}>Dukan Machinery</Text>
            <Text style={styles.companyMeta}>Agri-Industrial Solutions</Text>
            <Text style={styles.companyMeta}>Contact: geletupro@gmail.com | +251 912 713 823</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quotation</Text>
          <View style={styles.row}>
            <Text>Quotation No: <Text>{quotationNumber}</Text></Text>
            <Text>Issue Date: <Text>{fmtDate(issueDate)}</Text></Text>
          </View>
          <View style={styles.row}>
            <Text>Valid Until: <Text>{fmtDate(validUntil)}</Text></Text>
          </View>
        </View>

        <View style={[styles.section, styles.box]}>
          <View style={styles.grid2}>
            <View style={styles.grid2Col}>
              <Text style={styles.sectionTitle}>Customer</Text>
              <Text>Name: {customerName}</Text>
              {customerCompany ? <Text>Company: {customerCompany}</Text> : null}
              <Text>Email: {customerEmail}</Text>
            </View>
            <View style={styles.grid2Col}>
              <Text style={styles.sectionTitle}>Machine</Text>
              <Text>Product: {machineName}</Text>
              <Text>Quantity: {machineQuantity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>
          <View style={styles.table}>
            <View style={styles.th}>
              <Text style={styles.tdLeft}>Item</Text>
              <Text style={styles.tdRight}>Amount</Text>
            </View>
            <View style={styles.tr}>
              <Text style={styles.tdLeft}>Machine Cost</Text>
              <Text style={styles.tdRight}>{fmtCost(machineCost)}</Text>
            </View>
            <View style={styles.tr}>
              <Text style={styles.tdLeft}>Shipping Cost</Text>
              <Text style={styles.tdRight}>{fmtCost(shippingCost)}</Text>
            </View>
            <View style={styles.tr}>
              <Text style={styles.tdLeft}>Installation Cost</Text>
              <Text style={styles.tdRight}>{fmtCost(installationCost)}</Text>
            </View>
            <View style={styles.tr}>
              <Text style={styles.tdLeft}>Additional Charges</Text>
              <Text style={styles.tdRight}>{fmtCost(additionalCharges)}</Text>
            </View>
            <View style={styles.tr}>
              <Text style={[styles.tdLeft, { fontWeight: 700 }]}>Total</Text>
              <Text style={[styles.tdRight, { fontWeight: 700 }]}>{fmtCost(totalCost)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <View style={styles.notes}>
            <Text>{terms ? terms : 'Terms will be provided upon request.'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warranty</Text>
          <View style={styles.notes}>
            <Text>Standard warranty information will be applied according to machine model.</Text>
          </View>
        </View>

        <View style={styles.signatureRow}>
          <View style={styles.sigBox}>
            <Text style={styles.sectionTitle}>Authorized Signature</Text>
            <Text>____________________________</Text>
            <Text style={{ marginTop: 6 }}>Name: _______________________</Text>
            <Text>Title: _______________________</Text>
          </View>
          <View style={styles.sigBox}>
            <Text style={styles.sectionTitle}>Company Seal</Text>
            <View style={styles.stamp}>
              <Text>SEAL</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ marginTop: 14, textAlign: 'center', color: '#6b7280' }}>
            Thank you for your business.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

