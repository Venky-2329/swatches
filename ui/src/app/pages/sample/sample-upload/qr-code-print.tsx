import { Button, Descriptions, Modal, QRCode, Tag } from 'antd';
import { QrcodeCoulmnsReq } from 'libs/shared-models';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export const getCssFromComponent = (fromDoc, toDoc) => {
  Array.from(fromDoc.styleSheets).forEach((styleSheet: any) => {
    if (styleSheet.cssRules) {
      // true for inline styles
      const newStyleElement = toDoc.createElement('style');
      Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
        newStyleElement.appendChild(toDoc.createTextNode(cssRule.cssText));
      });
      toDoc.head.appendChild(newStyleElement);
    }
  });
};

export interface QrProps {
  qrcodeInfo: any[];
  columns: QrcodeCoulmnsReq[];
  qrcodeWidth?: number;
  qrcodeHeight?: number;
  newWindow: boolean;
  className?: string;
  closeQrcodePopUp?: () => void;
  printQrcodes?: () => void;
  withOutModal?: boolean;
}
export default function QrCodesPrint(props: QrProps) {
  const [showQrcodePopUp, setShowQrcodePopUp] = useState<boolean>(true);
  let externalWindow: any;
  let containerEl: any;

  console.log(props.qrcodeInfo);

  if (props.newWindow) {
    externalWindow = window.open(
      '',
      '',
      'width=600,height=500,left=200,top=50'
    );
    containerEl = externalWindow.document.createElement('div');
    externalWindow.document.body.appendChild(containerEl);
    externalWindow.document.title = 'Barcodes';
    const linkElement = externalWindow.document.createElement('link');
    linkElement.rel = 'stylesheet';
    externalWindow.document.head.appendChild(linkElement);
  }

  const printQrcodes = () => {
    const pageContent = document.getElementById('printArea');
    if (pageContent) {
      const divContents = pageContent.innerHTML;
      const element = window.open('', '', 'height=500, width=1024');
      if (element) {
        element.document.write(divContents);
        getCssFromComponent(document, element.document);
        element.document.close();
        element.print();
        element.close();
      }
      setShowQrcodePopUp(false);
      if (props.printQrcodes) {
        props.printQrcodes();
      }
    }
  };

  const hideModal = () => {
    setShowQrcodePopUp(false);
    if (props.closeQrcodePopUp) props.closeQrcodePopUp();
  };

  function compareLineNumber(a, b) {
    return a.lineNumber < b.lineNumber ? -1 : 1;
  }

  const renderContent = () => {
    try {
      const qrcodeInfo = props.qrcodeInfo;
      const acsOrderCoulmns = props.columns.sort(compareLineNumber);

      const qrcodeWidthHandler = (qrcodeWidth?: any) => {
        if (qrcodeWidth) {
          return `${props.qrcodeWidth}px`;
        }
        return '384px';
      };
      const qrcodeHeightHandler = (qrcodeWidth?: any) => {
        if (qrcodeWidth) {
          return `${props.qrcodeWidth}px`;
        }
        return '200px';
      };

      //     let keyCounter = 0;
      //     return qrcodeInfo.map((record, index) => {
      //       console.log(record)
      //       return (
      //         <React.Fragment key={'main' + keyCounter++}>
      //           <Descriptions key={'desc' + keyCounter++} column={4}
      //           size='small' >
      //             {acsOrderCoulmns.map((qrcodeDetails,_ix) => {
      //               const className = qrcodeDetails.className ? qrcodeDetails.className : '';
      //               const width = ((qrcodeDetails.span / 4) * 100);
      //               if (qrcodeDetails.showQrcode) {

      //                 return <Descriptions.Item key={'descitembar' + keyCounter++} span={qrcodeDetails.span} >
      //                   {<><QRCode size={120}
      //                     value={`http://172.20.50.169/design-room_app/#/sample-digital-card/${record.itemNo}`} type='svg'/>
      //                   </>
      //                   }</Descriptions.Item>;
      //               }
      //               else {
      //                 return <Descriptions.Item key={'descitem' + keyCounter++}
      //                   label={qrcodeDetails.showLabel ? qrcodeDetails.title : null}
      //                   span={qrcodeDetails.span}
      //                 >
      //                   {record[qrcodeDetails.dataIndex]}
      //                 </Descriptions.Item>;
      //               }

      //             })}
      //           </Descriptions>
      //           <style>
      //                   {`
      //       @page {
      //         size: 4in 2.5in; /* Set page size to 4x2 inches */
      //         margin: 0; /* Reset default margin */
      //       }

      //       body {
      //         margin: 0; /* Reset default margin */
      //       }`}
      //                   </style>
      //         </React.Fragment>
      //       );
      //     });
      //   } catch (err) {
      //     return <Tag color='red' key={'error'}>Error in Qrcode Genarations</Tag>;
      //   }
      // };

      let keyCounter = 0;
      const qrcodeContent = [];
      // Inside the loop where you render Descriptions
      qrcodeInfo.forEach((record, index) => {
        const quantity = record.quantity || 1; // Default to 1 if quantity is not provided
      
        for (let i = 0; i < quantity; i++) {
          qrcodeContent.push(
            <React.Fragment key={`main${keyCounter++}`}>
              <div className="qrcode-container">
                {/* QR Code */}
                <div className="qrcode-description">
                  {acsOrderCoulmns.map((qrcodeDetails, _ix) => {
                    const qrCodeWidth = qrcodeDetails.showQrcode ? 'auto' : '0%';
                    return (
                      qrcodeDetails.showQrcode && (
                        <div
                          key={`descitembar${keyCounter++}`}
                          style={{ width: qrCodeWidth, marginRight: '10px' }}
                          className="qrcode-description"
                        >
                          <QRCode
                            size={180}
                            value={`http://172.20.50.169/design-room_app/#/sample-digital-card/${record.sampleId}`}
                            type="svg"
                          />
                        </div>
                      )
                    );
                  })}
                </div>
      
                {/* Descriptions */}
                <div className="qrcode-description">
                  {acsOrderCoulmns.map((qrcodeDetails, _ix) => {
                    const descWidth = qrcodeDetails.showQrcode
                      ? `${(qrcodeDetails.span / 1) * 100}%`
                      : `${(qrcodeDetails.span / 1) * 100}%`;
                    return (
                      !qrcodeDetails.showQrcode && (
                        <div
                          key={`descitem${keyCounter++}`}
                          style={{
                            width: descWidth,
                          }}
                          className="qrcode-description"
                        >
                          {qrcodeDetails.lineNumber === 0 && (
                            <p style={{ fontSize: '25px' }}>Shahi Design Room</p>
                          )}
                          {qrcodeDetails.lineNumber === 1 && <p style={{ fontSize: '25px' }}>Bangalore</p>}
                          {qrcodeDetails.lineNumber !== 0 &&
                            qrcodeDetails.lineNumber !== 1 && (
                              <p style={{ fontSize: '25px' }}>{record[qrcodeDetails.dataIndex]}</p>
                            )}
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
              <style>
                {`
                  @page {
                    margin: 0;
                    font-size: 5px;
                  }
                  body {
                    margin: 0;
                    
                  }
                  .qrcode-container {
                    width: 2in;
                    height: 4in;
                    margin: 0.5in;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    page-break-after: always; /* Add page break after each qrcode-container */
                  }
                  .qrcode-description {
                    font-size: 3px;
                  }
                  @media print {
                    body {
                      transform: rotate(90deg);
                    }
                  }
                `}
              </style>
              
            </React.Fragment>
          );
        }
      });

      return qrcodeContent;
    } catch (err) {
      return (
        <Tag color="red" key={'error'}>
          Error in Qrcode Genarations
        </Tag>
      );
    }
  };

  if (props.withOutModal) {
    return (
      <React.Fragment>
        <div id="printArea">{renderContent()}</div>
      </React.Fragment>
    );
  } else {
    // Open in new window
    if (props.newWindow) {
      return ReactDOM.createPortal(
        <React.Fragment>
          <div id="printArea">{renderContent()}</div>
        </React.Fragment>,
        containerEl
      );
    } else {
      return (
        <React.Fragment>
          <Modal
            key={Date.now()}
            style={{ top: 10 }}
            width={500}
            title={
              <React.Fragment>
                Print Qrcodes{' '}
                <Button type="primary" onClick={printQrcodes}>
                  Print
                </Button>{' '}
              </React.Fragment>
            }
            visible={showQrcodePopUp}
            onCancel={(_e) => hideModal()}
            onOk={hideModal}
            footer={[]}
          >
            <div id="printArea">{renderContent()}</div>
          </Modal>
        </React.Fragment>
      );
    }
  }
}
