import { Button, QRCode, Space } from 'antd';
// import QRCode from "react-qr-code";
import ReactDOMServer from 'react-dom/server';
import jsPDF from 'jspdf';

export interface Props {
  data: any;
}

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

export default function DownloadQrCode(props: Props) {

  function downloadQr(val) {
    var print: any = ReactDOMServer.renderToString(
      <QRCode type="svg" value="http://localhost:4200/sample-digital-card" />
    );
    var doc = new jsPDF();
    doc.html(print, {
      callback: function (doc) {
        doc.save();
      },
      margin: 5,
      // autoPaging: 'text',
      x: 0,
      y: 0,
      width: 100, //target width in the PDF document
      windowWidth: 200, //window width in CSS pixels
    });
  }

  const printQrcodes = () => {
    console.log('1');
    const pageContent = document.getElementById('myqrcode');
    console.log('2', pageContent);
    const divContents = pageContent.innerHTML;
    const element = window.open('', '', 'height=700, width=1024');
    element.document.write(divContents);
    getCssFromComponent(document, element.document);
    element.document.close();
    setTimeout(() => {
      element.print();
      element.close();
    }, 1000);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.download = 'QRCode.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      {/* <Button onClick={printQrcodes}>Download Qr</Button> */}
      <div id="myqrcode">
        <QRCode
          type="canvas"
          value="http://localhost:4200/#/sample-digital-card"
        />
        <Button type="primary" onClick={downloadQRCode}>
         Download
    </Button>
      </div>
    </>
  );
}
