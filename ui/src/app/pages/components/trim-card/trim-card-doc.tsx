import { Button, Card } from 'antd'
import React from 'react'
import styles from './trim-card.module.css';
import * as XLSX from 'xlsx';
import titleLogo from './carhartt-logo.png'

export default function TrimCardDoc() {
    const handleExport = () => {
        const table = document.getElementById('trim-card-container');
        const wb = XLSX.utils.table_to_book(table);
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const s2ab = s => {
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
        <Card style={{ height: '100%' }} extra={<span><Button onClick={handleExport} type='primary'>Export</Button></span>}>
            <div className='trim-card-container'>
                <div className={styles.mainCard}>
                    <div className={styles.mainCardTitle}>
                        <div className={styles.brandTitle}></div>
                        <div className={styles.subTitle}>TRIM CARD</div>

                    </div>
                    <div className={styles.titleCardBody}>
                        <div className={styles.leftBody}>
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

                        </div>
                        <div className={styles.rightBody}>
                            <div className={styles.rightBodyTitle}>SKETCH</div>
                        </div>
                    </div>
                    <div className={styles.mainCardFooter}>
                        <div className={styles.footerLeftBody} >
                            <table >
                                <tbody>
                                    <tr>
                                        <th>PREPARED BY</th>
                                        <th>:</th>
                                        <td>PREPARED BY Value</td>

                                    </tr>
                                    <tr>
                                        <th>APPROVED BY</th>
                                        <th>:</th>

                                        <td>APPROVED BY Value</td>
                                    </tr>
                                    <tr>
                                        <th>QA APPROVAL</th>
                                        <th>:</th>
                                        <td>QA APPROVAL Value</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.footerRightBody}>
                            <table >
                                <tbody>
                                    <tr>
                                        <th>REMARKS</th>
                                        <th>:</th>
                                        <td></td>

                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th>:</th>

                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th></th>
                                        <th>:</th>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={styles.placementsCard} >
                    <table >
                        <tr >
                            <td><b>Placements</b></td>
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
                        <tr>
                            <td colSpan={10}>Fabric</td>
                        </tr>
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
    )
}
