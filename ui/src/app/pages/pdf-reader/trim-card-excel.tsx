import { Button, Card } from 'antd';
import React from 'react';
import styles from './trim-card.module.css';
import * as XLSX from 'xlsx';
import titleLogo from './carhartt-logo.png';

export default function TrimCardExcelDoc() {
  const handleExport = () => {
    const table = document.getElementById('trim-card-container');
    const wb = XLSX.utils.table_to_book(table);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <>
      <Card
        style={{ height: '100%' }}
        extra={
          <span>
            <Button onClick={handleExport} type="primary">
              Export
            </Button>
          </span>
        }
      >
        <table id={'trim-card-container'} className="trim-card-container">
          <thead>
            <tr style={{ justifyContent: 'center' }}>
              <td>
                <img src={titleLogo} />
              </td>
              <td className={styles.subTitle}>TRIM CARD </td>
            </tr>
            <table className={styles.leftBodyTable}>
              <tbody>
                <tr>
                  <th>DATE</th>
                  <td>:</td>
                  <td>Date Value</td>
                </tr>
                <tr>
                  <th>STYLE</th>
                  <td>:</td>

                  <td>Style Value</td>
                </tr>
                <tr>
                  <th>SEASON PO#</th>
                  <td>:</td>

                  <td>Season PO# Value</td>
                </tr>
                <tr>
                  <th>QTY</th>
                  <td>:</td>

                  <td>Qty Value</td>
                </tr>
                <tr>
                  <th>ITEM no.</th>
                  <td>:</td>

                  <td>ITEM NO Value</td>
                </tr>
                <tr>
                  <th>FACTORY</th>
                  <td>:</td>

                  <td>FACTORY Value</td>
                </tr>
                <tr>
                  <th>WASH</th>
                  <td>:</td>

                  <td>WASH Value</td>
                </tr>
              </tbody>
            </table>
          </thead>
        </table>
      </Card>
    </>
  );
}
