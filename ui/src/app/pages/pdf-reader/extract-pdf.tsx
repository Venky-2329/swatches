import {
  SubTypeDetails,
  TrimDetails,
  TrimPodfModel,
  TrimTypes,
} from 'libs/shared-models';
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
console.log(pdf)
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


  const types = [
    filteredData[200]?.str,
    filteredData[202]?.str,
    filteredData[303]?.str,
    filteredData[308]?.str,
  ];
  const sumNumbersInBrackets = (types) => {
    let sum = 0;
    types.forEach((item) => {
      const match = item.match(/\((\d+)\)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        sum += number;
      }
    });
    return sum;
  };

  const result = sumNumbersInBrackets(types);

  const subtypesData = [ filteredData[201]?.str, filteredData[203]?.str, filteredData[204]?.str, filteredData[304]?.str, filteredData[305]?.str, filteredData[306]?.str, filteredData[307]?.str, filteredData[309]?.str, filteredData[443]?.str, filteredData[444]?.str, filteredData[445]?.str, filteredData[446]?.str,
  ];
  const sumNumInBrackets = (types) => {
    let sum = 0;
    types.forEach((item) => {
      const match = item.match(/\((\d+)\)/);
      if (match && match[1]) {
        const number = parseInt(match[1], 10);
        sum += number;
      }
    });
    return sum;
  };

  const res = sumNumInBrackets(subtypesData);

  const resultArray = []

  for (let i = 0; i < res; i++) {
    const typeIndex = [200, 202, 202, 202, 202, 202,303, 303, 303, 303, 303, 308, 308, 308, 308, 308, 308, 308, 308];
    const subTypesIndex = [201, 203, 203, 203, 204, 204, 304, 305, 306, 306, 307, 309, 443, 444, 445,445, 445, 445, 446];
    const codesIndex = [140 ,153,163,177,187,229,241,251,267,281,292,334,351,365,378,391,404,417,430];
    const productsIndex =                    [141,154,164,178,188,230,242,252,268,282,293,335,352,366,379,392,405,418,431];
    const materialArtworkDescriptionsIndex = [null,156,167,180,190,231,243,null,270,283,null,null,null,null,null,null,null,null];
    const supplierQuotesIndex =              [ 142, 157, 170, 181, 192, 233, 245, 254, 274, 285, 294, 337, 354, 368, 381, 394, 406, 420, 432,];
    const supplierCodesIndex =               [null, 158, null,null,null,null,null,255,null,null,null,340,null,null,383,396,409,422,434];
    const uomsIndex =                        [144, 159, 172, 183, 195 , 235, 247, 257, 276, 287, 295, 343, 356, 370,385,398,411,424,435];
    const placementsIndex =                  [145, 150, 173, 184, 196 , 236, 248, 258, 277, 288, 296, 344, 357, 371,386,399,412,423,436];
    const contractorSuppliedsIndex =         [null];
    const brnBrownColorsIndex =              [146,null,null,null,null,null,null,261,null,null, 297,345, 358, 372, 387, 400, 413, 424,437];
    const brnBrownQtyByColorsIndex =         [149 ,151, 174, 185,198, 239, 249, 263, 279, 290, 299,347, 360, 374, null, null,null,null,null];
    const blkBlackColorsIndex =              [150,null,null,null,null,null,null,264,null,null, 300,348, 361, 375, 389, 402, 415, 426,441 ];
    const blkBlackQtyByColorsIndex =         [152, 152, 175, 186,199, 240, 250, 266, 280, 300, 302,350, 364, 377, ];
    const trimDetails = new TrimDetails()
    const typesDetails = new TrimTypes()
    if (i < typeIndex.length) {
      typesDetails.type = filteredData[typeIndex[i]].str;
    }
    if (i < subTypesIndex.length) {
      typesDetails.subType = filteredData[subTypesIndex[i]].str;
    }
    trimDetails.code = codesIndex[i] < filteredData.length && filteredData[codesIndex[i]] ? filteredData[codesIndex[i]].str : '';
    trimDetails.product = productsIndex[i] < filteredData.length && filteredData[productsIndex[i]] ? filteredData[productsIndex[i]].str : '';
    trimDetails.materialArtworkDescription = materialArtworkDescriptionsIndex[i] < filteredData.length && filteredData[materialArtworkDescriptionsIndex[i]] ? filteredData[materialArtworkDescriptionsIndex[i]].str : '';
    trimDetails.supplierQuote = supplierQuotesIndex[i] < filteredData.length && filteredData[supplierQuotesIndex[i]] ? filteredData[supplierQuotesIndex[i]].str : '';
    trimDetails.supplierCode = supplierCodesIndex[i] < filteredData.length && filteredData[supplierCodesIndex[i]] ? filteredData[supplierCodesIndex[i]].str : '';
    trimDetails.uom = uomsIndex[i] < filteredData.length && filteredData[uomsIndex[i]] ? filteredData[uomsIndex[i]].str : '';
    trimDetails.placement = placementsIndex[i] < filteredData.length && filteredData[placementsIndex[i]] ? filteredData[placementsIndex[i]].str : '';
    trimDetails.contractorSupplied = contractorSuppliedsIndex[i] < filteredData.length && filteredData[contractorSuppliedsIndex[i]] ? filteredData[contractorSuppliedsIndex[i]].str : '';
    trimDetails.brnBrownColor = brnBrownColorsIndex[i] < filteredData.length && filteredData[brnBrownColorsIndex[i]] ? filteredData[brnBrownColorsIndex[i]].str : '';
    trimDetails.brnBrownQtyByColor = brnBrownQtyByColorsIndex[i] < filteredData.length && filteredData[brnBrownQtyByColorsIndex[i]] ? filteredData[brnBrownQtyByColorsIndex[i]].str : '';
    trimDetails.blkBlackColor = blkBlackColorsIndex[i] < filteredData.length && filteredData[blkBlackColorsIndex[i]] ? filteredData[blkBlackColorsIndex[i]].str : '';
    trimDetails.blkBlackQtyByColor = blkBlackQtyByColorsIndex[i] < filteredData.length && filteredData[blkBlackQtyByColorsIndex[i]] ? filteredData[blkBlackQtyByColorsIndex[i]].str : '';

    typesDetails.trimDetails = trimDetails
     resultArray.push(typesDetails)
  }

  trimPdf.style = filteredData[styleIndex + 1]?.str;
  trimPdf.season = filteredData[seasonIndex + 1]?.str;
  trimPdf.trimTypes = resultArray;
  console.log(trimPdf);

  return trimPdf;
};
