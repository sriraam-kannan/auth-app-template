import neoAxios from "@/lib/neoAxios";
import { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function Reports() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<any[]>([]);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
      filter: true,
      minWidth: 100,
      cellDataType: false,
    };
  }, []);

  const reportsData = async () => {
    try {
      const response = await neoAxios.get("/getReports");
      const reportData = response?.data?.data;
      if (reportData && Array.isArray(reportData)) {
        setRowData(reportData);
        if (reportData.length > 0) {
          const columnDefs = Object.keys(reportData[0]).map((key) => ({
            field: key,
          }));
          setColDefs(columnDefs);
        }
      }
    } catch (error) {
      console.error("Error fetching reports data", error);
    }
  };

  useEffect(() => {
    reportsData();
  }, []);

  return (
    <div className="flex flex-1 p-4 bg-slate-50">
      <div className="ag-theme-quartz flex-1">
        <AgGridReact
          columnDefs={colDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </div>
  );
}
