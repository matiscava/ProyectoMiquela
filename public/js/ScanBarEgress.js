import { docReady, getScan } from "./helpers/scanBar.js";

export function ScanBarEgress(){
    docReady( getScan('qr-reader-results') )
}