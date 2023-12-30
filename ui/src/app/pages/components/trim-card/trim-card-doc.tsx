import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './trim-card.module.css';
import * as XLSX from 'xlsx';
import titleLogo from './carhartt-logo.png';
import { useParams } from 'react-router-dom';
import { getPdfData, getPdfGridData } from 'libs/shared-services';
import { PdfIdReq } from 'libs/shared-models';
import jsPDF from 'jspdf';
import moment from 'moment';
import img from '../../../../assets/Dev pic-57f9.jpg';
import titleImg from '../../../../assets/carhartt-logo.png';
import excelImg from '../../../../assets/Picture1.png'

export default function TrimCardDoc() {
  const params = useParams();
  const [data, setData] = useState([]);

//   async function convertHtmlToPdf() {
//     const doc = new jsPDF();
//     const htmlElement = document.getElementById('trim-card-container');
//     let invoiceBufferDoc;
//     await doc.html(htmlElement, {
//       callback: function (doc) {
//         // Additional styling or manipulation of the PDF if needed
//         invoiceBufferDoc = doc.output('arraybuffer')
//       },
//       margin: 1,
//       autoPaging: 'text',
//       x: 0,
//       y: 0,
//       width: 200, // target width in the PDF document
//       windowWidth: 1050, // window width in CSS pixels
//     });
//       doc.save('trim-card.pdf');
//   }

async function convertHtmlToPdf() {
    const doc = new jsPDF();
    const htmlElement = document.getElementById('trim-card-container');
    const cssResponse = await fetch('./trim-card.module.css');
    const cssContent = await cssResponse.text();
    htmlElement.innerHTML += `<style>${cssContent}</style>`;
    let invoiceBufferDoc;
    await doc.html(htmlElement, {
      callback: function (doc) {
        invoiceBufferDoc = doc.output('arraybuffer');
      },
      margin: 1,
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 200,
      windowWidth: 1050,
    });
    doc.save('trim-card.pdf');
  }
  
  useEffect(() => {
    if (params.id) {
      get();
    }
  }, [params.id]);

  function get() {
    const req = new PdfIdReq();
    req.pdfId = Number(params.id);
    getPdfData(req).then((res) => {
      if (res.data) {
        setData(res.data);
      } else {
        setData([]);
      }
    });
  }

  console.log(data);

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

  let prevType = null;
  let prevSubType = null;
  return (
    <>
      <Card
        style={{ height: '100%' }}
        extra={
          <span>
            <Button onClick={convertHtmlToPdf} type="primary">
              Export
            </Button>
          </span>
        }
      >
        <div id="trim-card-container" className='trim-card-container'>
          <div className={styles.mainCard}>
            <div className={styles.mainCardTitle}>
            <div >
              <img src={titleImg}></img>
            </div>
              <div className={styles.subTitle}>TRIM CARD</div>
            </div>
            <div className={styles.titleCardBody}>
              <div className={styles.leftBody}>
                <table className={styles.leftBodyTable}>
                  <tbody>
                    <tr>
                      <th>DATE</th>
                      <td>:</td>
                      <td>{data[0]?.trimDate ? moment(data[0]?.trimDate).format('YYYY-MM-DD') : ''}</td>
                    </tr>
                    <tr>
                      <th>STYLE</th>
                      <td>:</td>
                      <td>{data[0]?.style ? data[0]?.style : ''}</td>
                    </tr>
                    <tr>
                      <th>SEASON</th>
                      <td>:</td>
                      <td>{data[0]?.season ? data[0]?.season : ''}</td>
                    </tr>
                    <tr>
                      <th>PO #</th>
                      <td>:</td>
                      <td>{data[0]?.poNumber ? data[0]?.poNumber : ''}</td>
                    </tr>
                    <tr>
                      <th>QTY</th>
                      <td>:</td>
                      <td>{data[0]?.quantity ? data[0]?.quantity : ''}</td>
                    </tr>
                    <tr>
                      <th>ITEM no.</th>
                      <td>:</td>
                      <td>{data[0]?.itemNo ? data[0]?.itemNo : ''}</td>
                    </tr>
                    <tr>
                      <th>FACTORY</th>
                      <td>:</td>
                      <td>{data[0]?.factory ? data[0]?.factory : ''}</td>
                    </tr>
                    <tr>
                      <th>WASH</th>
                      <td>:</td>
                      <td>{data[0]?.wash ? data[0]?.wash : ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.rightBody}>
                <div className={styles.rightBodyTitle}>SKETCH</div>
                <div className={styles.centeredImageContainer}>
                <img height={'100px'} src={img}></img>
                </div>
              </div>
              
            </div>
            <div className={styles.mainCardFooter}>
              <div className={styles.footerLeftBody}>
                <table>
                  <tbody>
                    <tr>
                      <th>PREPARED BY</th>
                      <th>:</th>
                      <td>{data[0]?.preparedBy ? data[0]?.preparedBy : ''}</td>
                    </tr>
                    <tr>
                      <th>APPROVED BY</th>
                      <th>:</th>
                      <td>{data[0]?.approvedBy ? data[0]?.approvedBy : ''}</td>
                    </tr>
                    <tr>
                      <th>QA APPROVAL</th>
                      <th>:</th>
                      <td>{data[0]?.qaApproval ? data[0]?.qaApproval : ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.footerRightBody}>
                <table>
                  <tbody>
                    <tr>
                      <th>REMARKS</th>
                      <th>:</th>
                      <td>{data[0]?.remarks ? data[0]?.remarks : ''}</td>
                    </tr>
                    <tr>
                      <th></th>
                      <th></th>
                      <td></td>
                    </tr>
                    <tr>
                      <th></th>
                      <th></th>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={styles.placementsCard}>
            <table>
              <tr>
                <td colSpan={10}>
                  <b>Placements</b>
                </td>
              </tr>
              <tr className={styles.greyRow}>
                <th rowSpan={2}>Code</th>
                <th rowSpan={2}>Product</th>
                <th rowSpan={2}>Material Artwork Description</th>
                <th rowSpan={2}>Supplier Quote</th>
                <th rowSpan={2}>Placement</th>
                <th rowSpan={2}>Contractor Supplied</th>
                <th colSpan={2}>BRN-Carhartt Brown</th>
                <th colSpan={2}>BLK-Black</th>
              </tr>
              <tr className={styles.greyRow}>
                <th>Color</th>
                <th>Qty by Color</th>
                <th>Color</th>
                <th>Qty by Color</th>
              </tr>

              {data.map((i) => {
                const showType = i.type !== undefined && i.type !== prevType;
                prevType = i.type;

                const showSubType =
                  i.subType !== undefined && i.subType !== prevSubType;
                prevSubType = i.subType;
                return (
                  <>
                    {showType && (
                      <tr className={styles.greyRow}>
                        <td colSpan={10}>{i.type}</td>
                      </tr>
                    )}
                    {showSubType && (
                      <tr className={styles.greyRow}>
                        <td colSpan={10}>{i.subType}</td>
                      </tr>
                    )}
                    <tr>
                      <th >{i.code ? i.code : ''}</th>
                      <th >{i.product ? i.product : ''}</th>
                      <th >
                        {i.materialArtworkDesc ? i.materialArtworkDesc : ''}
                      </th>
                      <th >
                        {i.supplierQuote ? i.supplierQuote : ''}
                      </th>
                      <th >{i.placement ? i.placement : ''}</th>
                      <th >
                        {i.contractorSupplied ? i.contractorSupplied : ''}
                      </th>
                      <th >
                        {i.brnBrownColor ? i.brnBrownColor : ''}
                      </th>
                      <th >
                        {i.brnBrownQtyByColor ? i.brnBrownQtyByColor : ''}
                      </th>
                      <th >
                        {i.blkBlackColor ? i.blkBlackColor : ''}
                      </th>
                      <th >
                        {i.blkBlackQtyByColor ? i.blkBlackQtyByColor : ''}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={1} style={{ height: '80px' }}></th>
                      <th colSpan={1}></th>
                      <th colSpan={1}>
                        
                      </th>
                      <th colSpan={1}>
                        
                      </th>
                      <th colSpan={1}></th>
                      <th colSpan={1}>
                        
                      </th>
                      <th colSpan={2}>
                        <img height={'100px'} src={excelImg}></img>
                      </th>
                      <th colSpan={2}>
                      <img height={'100px'} src={excelImg}></img>
                      </th>
                    </tr>
                  </>
                );
              })}
            </table>
          </div>
        </div>
        {/* <table id={'trim-card-container'} className='trim-card-container' >
                <thead>
                <tr style={{alignContent:'center'}}>
                    <td>
                        <img src={titleLogo} />
                    </td>
                    <td className={styles.subTitle}>TRIM CARD </td>
                </tr>
                </thead>

            </table> */}
      </Card>
    </>
  );
}
