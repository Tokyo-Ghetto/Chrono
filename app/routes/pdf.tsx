import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { generateReportData } from "~/services/report.server";
import { getAuth } from "@clerk/remix/ssr.server";
import { useEffect, useState } from "react";
import { PortfolioReport } from "~/components/pdf/PortfolioReport";

interface LoaderData {
  reportData: Awaited<ReturnType<typeof generateReportData>>;
}

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }

  const reportData = await generateReportData(userId);
  return json({ reportData });
};

export default function PDFPreview() {
  const { reportData } = useLoaderData<LoaderData>();
  const [PDFViewer, setPDFViewer] = useState<any>(null);

  useEffect(() => {
    // Dynamically import PDFViewer only on client side
    import("@react-pdf/renderer").then((module) => {
      setPDFViewer(() => module.PDFViewer);
    });
  }, []);

  if (!PDFViewer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading PDF viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <PDFViewer width="100%" height="100%">
        <PortfolioReport data={reportData} />
      </PDFViewer>
    </div>
  );
}
