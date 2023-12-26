import { TrimDetails, TrimPodfModel, TrimTypes } from 'libs/shared-models';
import {
  BOLD_HEIGHT_1,
  BOLD_HEIGHT_2,
  EMP_STR_EXP,
  UNWANTED_TEXT_1,
} from './pdf-regex-expressions';

export const PdfDataExtractor = async (pdf) => {
  const itemsArr: { itemNo: string; itemIndex: number }[] = [];
  const filteredData = [];
  const trimPdf: TrimPodfModel = new TrimPodfModel();

  for (let i = 1; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent: any = await page.getTextContent();
    let startFlag = false;
    let endFlag = false;
    const pageContent = textContent.items.filter((val, index) => {
      if (val.str === 'POMs') {
        startFlag = true;
      }
      if (endFlag) {
        startFlag = false;
        endFlag = false;
      }
      if (val.str === 'Nail Apron Total Width - at Bottom') {
        endFlag = true;
      }

      return !(
        val.str.includes(UNWANTED_TEXT_1) ||
        EMP_STR_EXP.test(val.str) ||
        val.height === BOLD_HEIGHT_1 ||
        val.height === BOLD_HEIGHT_2 ||
        startFlag
      );
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
    if (rec.str === 'Season') {
      seasonIndex = index;
    }
    if (rec.str === 'Nicole Clement') {
      codeIndex = index;
    }
  }
  console.log(codeIndex);
  // 140 - 117
  const type = filteredData[200].str;
  const subtype = filteredData[201].str;
  const code = filteredData[codeIndex + 23].str;
  const product = filteredData[codeIndex + 24].str;
  const supplQuote =filteredData[codeIndex + 25].str + ' ' + filteredData[codeIndex + 26].str;
  const uom = filteredData[codeIndex + 27].str;
  const placement = filteredData[codeIndex + 28].str;
  const brnBrownColor =filteredData[codeIndex + 29].str +filteredData[codeIndex + 30].str +' ' +filteredData[codeIndex + 31].str;
  const brnQtyByColor = filteredData[codeIndex + 32].str;
  const blkBlack = filteredData[codeIndex + 33].str + filteredData[codeIndex + 34].str;
  const blkQtyByColor = filteredData[codeIndex + 34].str;
  const trimeDetails = new TrimDetails();
  trimeDetails.code = code;
  trimeDetails.product = product;
  trimeDetails.supplierQuote = supplQuote;
  trimeDetails.uom = uom;
  trimeDetails.placement = placement;
  trimeDetails.brnBrownColor = brnBrownColor;
  trimeDetails.brnBrownQtyByColor = brnQtyByColor;
  trimeDetails.blkBlackColor = blkBlack;
  trimeDetails.blkBlackQtyByColor = blkQtyByColor;
  const typesDetails = new TrimTypes();
  typesDetails.type = type;
  typesDetails.subType = subtype;
  // typesDetails.trimDetails = trimeDetails;
  trimPdf.style = filteredData[styleIndex + 1]?.str;
  trimPdf.season = filteredData[seasonIndex + 1]?.str;
  trimPdf.trimTypes = [typesDetails];
 
  const types = [filteredData[200]?.str ,filteredData[202]?.str ,filteredData[303]?.str ,filteredData[308]?.str]
  console.log(types.length)
  const sumNumbersInBrackets = (types) => {
    let sum = 0;
    types.forEach(item => {
      const match = item.match(/\((\d+)\)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        sum += number;
      }
    });
    return sum;
  };
  
  const result = sumNumbersInBrackets(types);

  // for (let i = 0; i < types.length; i++) {
  //   const type = types[i];
  //   console.log(`Type at index ${i}:`, type);
  // }

  // for (let i = 1; i <= result; i++) {
  //   console.log(`Iteration ${i}`);
  //   const typeIndex = [200,202,303,308]
    
  // }

  const typeIndex = [200, 202, 303, 308];
  const codesIndex = [140]
  const productsIndex = [141]

for (let i = 0; i < types.length; i++) {
  const type = types[i];
  const match = type.match(/\((\d+)\)/);

  if (match && match[1]) {
    const iterationCount = parseInt(match[1], 10);
    for (let j = 1; j <= iterationCount; j++) {
      const typeIndexValue = typeIndex[i];
      const typeForIndex = filteredData[typeIndexValue]?.str;
      console.log(`Type at index ${i}, Iteration ${j}:`, typeForIndex);
    }
  } else {
    console.log(`Invalid format for type at index ${i}:`, type);
  }
}

  console.log(trimPdf);

  return trimPdf;
};
