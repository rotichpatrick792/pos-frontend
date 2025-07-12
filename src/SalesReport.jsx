import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct way to import

const SalesReport = ({ onBack }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('https://pos-backend-m1qe.onrender.com/api/sales')
      .then(res => setSales(res.data))
      .catch(err => console.error('Error fetching sales:', err));
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(sales);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SalesReport");

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Sales_Report.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 14, 10);

    const tableData = sales.map(sale => [
      sale.id,
      sale.product_id,
      sale.quantity_sold,
      sale.total_price,
      new Date(sale.date_time).toLocaleString()
    ]);

    autoTable(doc, {
      head: [['ID', 'Product ID', 'Quantity', 'Total Price (Ksh)', 'Date/Time']],
      body: tableData,
      startY: 20
    });

    doc.save('Sales_Report.pdf');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Sales Report</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={exportToExcel}>
            📥 Export Excel
          </button>
          <button className="btn btn-outline-danger me-2" onClick={exportToPDF}>
            📄 Export PDF
          </button>
          <button className="btn btn-secondary" onClick={onBack}>
            ← Back to POS
          </button>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="alert alert-warning">No sales found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Product ID</th>
                <th>Quantity Sold</th>
                <th>Total Price (Ksh)</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.product_id}</td>
                  <td>{sale.quantity_sold}</td>
                  <td>{sale.total_price}</td>
                  <td>{new Date(sale.date_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
