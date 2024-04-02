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
      let keyCounter = 0;
      const qrcodeContent = [];
      // Inside the loop where you render Descriptions
      qrcodeInfo.forEach((record, index) => {
        const quantity = 1;
        for (let i = 0; i < quantity; i++) {
          qrcodeContent.push(
            <React.Fragment key={`main${keyCounter++}`}>
              <div className="qrcode-container">
                <div >
                  {acsOrderCoulmns.map((qrcodeDetails, _ix) => {
                    const qrCodeWidth = qrcodeDetails.showQrcode ? 'auto' : '0%';
                    return (
                      qrcodeDetails.showQrcode && (
                        <div
                          key={`descitembar${keyCounter++}`}
                          style={{ width: 'auto'}}
                          // className="qrcode-description"
                        >
                          <QRCode
                            size={180}
                            value={`http://ddr7.shahi.co.in/design-room_app/#/sample-digital-card/${record.sampleId}`}
                            type="svg"
                          />
                        </div>
                      )
                    );
                  })}
                </div>
      
                <div >
                  {acsOrderCoulmns.map((qrcodeDetails, _ix) => {
                    const descWidth = qrcodeDetails.showQrcode
                      ? `${(qrcodeDetails.span / 1) * 100}%`
                      : `${(qrcodeDetails.span / 1) * 100}%`;
                    return (
                      !qrcodeDetails.showQrcode && (
                        <div
                          key={`descitem${keyCounter++}`}
                          style={{
                            width: '400%',
                          }}
                        >
                          {qrcodeDetails.lineNumber === 0 && (
                            <p style={{ fontSize: '25px' }}>Shahi Sample Library</p>
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
                  @media print {
                    .qrcode-container {
                      transform: rotate(90deg);
                    } 
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

      return (
          <Modal
            key={Date.now()}
            style={{ top: 10 }}
            width={500}
            title={
              <div>
                Print Qrcodes{' '}
                <Button type="primary" onClick={printQrcodes}>
                  Print
                </Button>{' '}
              </div>
            }
            open={showQrcodePopUp}
            onCancel={(_e) => hideModal()}
            onOk={hideModal}
            footer={[]}
          >
            <div id="printArea">{renderContent()}</div>
          </Modal>
      );
}
