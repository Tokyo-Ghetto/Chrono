import { Document, Page } from "@react-pdf/renderer";
import {
  HeaderSection,
  HoldingsSection,
  SummarySection,
  FooterSection,
  ChartSection,
} from "./ReportComponents";
import type { PortfolioReportData } from "~/types/report";

export const PortfolioReport = ({ data }: { data: PortfolioReportData }) => {
  return (
    <Document>
      <Page size="LETTER">
        <HeaderSection userName={data.userName} date={data.reportDate} />
        <SummarySection summary={data.portfolioSummary} />
        <HoldingsSection holdings={data.holdings} />
        <ChartSection
          holdings={data.holdings}
          summary={data.portfolioSummary}
        />
        <FooterSection />
      </Page>
    </Document>
  );
};
