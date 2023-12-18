import { TrimPodfModel } from "libs/shared-models";
import { EMP_STR_EXP } from "./pdf-regex-expressions";

export const PdfDataExtractor = async (pdf) => {
    const itemsArr: { itemNo: string, itemIndex: number }[] = []
    const filteredData = []
    const trimPdf: TrimPodfModel = new TrimPodfModel()

    for (let i = 1; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent: any = await page.getTextContent();
        //parsing  dia data 
        const pageContent = textContent.items.filter((val, index) => {
            return !(
                EMP_STR_EXP.test(val.str)
               
            )
        })

        filteredData.push(...pageContent)
    }
    console.log(filteredData)

    trimPdf.style = filteredData[17]?.str;
    trimPdf.season = filteredData[25]?.str;
    trimPdf.code = filteredData[267]?.str;
    trimPdf.product = filteredData[268]?.str;
    trimPdf.blkBlackQtyByColor = '';
    trimPdf.supplierQuote = filteredData[269]?.str;
    trimPdf.supplierCode = '';
    trimPdf.uom = filteredData[270]?.str;
    trimPdf.placement = filteredData[271]?.str;
    trimPdf.contractorSupplied = '';
    trimPdf.brnBrownColor = filteredData[272]?.str

    console.log(trimPdf)


    return trimPdf
}