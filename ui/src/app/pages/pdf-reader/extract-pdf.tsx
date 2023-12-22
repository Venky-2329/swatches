import { TrimPodfModel } from 'libs/shared-models';
import { EMP_STR_EXP } from './pdf-regex-expressions';

export const PdfDataExtractor = async (pdf) => {
  const itemsArr: { itemNo: string; itemIndex: number }[] = [];
  const filteredData = [];
  const trimPdf: TrimPodfModel = new TrimPodfModel();

  for (let i = 1; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent: any = await page.getTextContent();
    //parsing  dia data
    const pageContent = textContent.items.filter((val, index) => {
      return !EMP_STR_EXP.test(val.str);
    });

    filteredData.push(...pageContent);
  }
  console.log(filteredData);

  let styleIndex;
  let seasonIndex;
  let codeIndex;

  for (const [index, rec] of filteredData.entries()) {
    if (rec.str.includes('Style #')) {
      styleIndex = index;
    }
    if(rec.str === 'Season'){
        seasonIndex = index
    }
    if(rec.str.includes('Code')){
      codeIndex = index
    }
  }
  console.log(codeIndex);

  trimPdf.style = filteredData[styleIndex + 1]?.str;
  trimPdf.season = filteredData[seasonIndex + 1]?.str;
  trimPdf.code = filteredData[codeIndex + 1]?.str;

  trimPdf.product = filteredData[268]?.str;
  trimPdf.materialArtworkDescription = '';
  trimPdf.supplierQuote = filteredData[269]?.str + ' ' + filteredData[270]?.str;
  trimPdf.supplierCode = '';
  trimPdf.uom = filteredData[271]?.str;
  trimPdf.placement = filteredData[272]?.str;
  trimPdf.contractorSupplied = '';
  trimPdf.brnBrownColor =
    filteredData[273]?.str +
    filteredData[274]?.str +
    ' ' +
    filteredData[275]?.str;
  trimPdf.brnBrownQtyByColor = filteredData[276]?.str;
  trimPdf.blkBlackColor = filteredData[277]?.str + filteredData[278]?.str;
  trimPdf.blkBlackQtyByColor = filteredData[279]?.str;
  console.log(trimPdf);

  return trimPdf;
};
