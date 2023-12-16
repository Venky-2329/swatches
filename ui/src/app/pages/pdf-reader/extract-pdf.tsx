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
    let poNumberIndex;
    let cabCodeIndex;
    let shipToStartIndex;
    let shipToEndIndex
    for(const [index,rec] of filteredData.entries()){
        if(rec.str.includes("Delivery Instructions:")){
            poNumberIndex = index
        }
        if(rec.str.includes("CAB Code:")){
            cabCodeIndex = index
        }
        if(rec.str.includes("Ship To Address:")){
            shipToStartIndex = index
        }
        if(rec.str.includes("Notify Parties:")){
            shipToEndIndex = index
        }
    }
    console.log(filteredData)
    // trimPdf.cabCode = filteredData[cabCodeIndex + 1].str
    // const deliveryInstructionsStr = filteredData[poNumberIndex].str.split(":")[1];
    // trimPdf.poNumber = deliveryInstructionsStr.split("-")[0].replace(/ /g, '')
    // trimPdf.lineNo = deliveryInstructionsStr.split("-")[1].replace(/ /g, '')
    // const addarr = filteredData.slice(shipToStartIndex,shipToEndIndex)
    // console.log(addarr)
    // trimPdf.shipToAddress = filteredData.slice(shipToStartIndex + 1,shipToEndIndex).map((a) => a.str).join(",")

    return trimPdf
}