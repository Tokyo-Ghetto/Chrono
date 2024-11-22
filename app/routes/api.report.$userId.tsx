import { json, LoaderFunction } from "@remix-run/node";
import { generateReportData } from "~/services/report.server";
import { getAuth } from "@clerk/remix/ssr.server";

export const loader: LoaderFunction = async (args) => {
  const { userId: currentUser } = await getAuth(args);
  const { userId } = args.params;

  if (!currentUser || currentUser !== userId) {
    return json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const reportData = await generateReportData(userId);
    return json(reportData);
  } catch (error) {
    console.error("Error generating report data:", error);
    return json({ message: "Error generating report" }, { status: 500 });
  }
};
