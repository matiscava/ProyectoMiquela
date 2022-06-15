import { ClientTable } from "./js/ClientTable.js";
import { HistoryEgress } from "./js/HistoryEgress.js";
import { HistoryIngress } from "./js/HistoryIngress.js";
import { HistoryTable } from "./js/HistoryTable.js"
import { ProductTable } from "./js/ProductTable.js";
import { SignupForm } from "./js/SignupForm.js";
import { ProductUpgradeForm } from "./js/ProductUpgradeForm.js";
import { ProductCreateForm } from "./js/ProductCreateForm.js";
import { ClientCreateForm } from "./js/ClientCreateForm.js";
import { ClientUpgradeForm } from "./js/ClientUpgradeForm.js";
import { HistoryUpgradeForm } from "./js/HistoryUpgradeForm.js";
import { ScanBarEgress } from "./js/ScanBarEgress.js";
import hamburgerMenu from "./js/hamburgerButton.js";

let getLocation = window.location.pathname;
document.addEventListener('DOMContentLoaded', (e) => {
  if(getLocation === '/clients'){
    ClientTable();
  }
  if(getLocation === '/clients/create-client'){
    ClientCreateForm();
  }
  if(getLocation.includes('/clients/upgrade/')){
    ClientUpgradeForm();
  }
  if(getLocation === '/history'){
    HistoryTable();
  }
  if(getLocation === '/history/egress'){
    HistoryEgress();
  }
  if(getLocation === '/history/ingress'){
    HistoryIngress();
  }
  if(getLocation.includes('/history/upgrade/')){
    HistoryUpgradeForm();
  }
  if(getLocation === '/products'){
    ProductTable();
  }
  if(getLocation.includes('/products/upgrade/')){
    ProductUpgradeForm();
  }
  if(getLocation === '/products/create-product'){
    ProductCreateForm();
  }
  if (getLocation.includes('/products/product-') || getLocation.includes('/clients/client-') || getLocation.includes('/history/history-')) {

  }
  if(getLocation === '/users/signup'){
    SignupForm();
  } 
})

if( 
  getLocation === '/history/egress' || 
  getLocation === '/history/ingress' || 
  getLocation === '/products/create-product' ||
  getLocation.includes('/products/upgrade/') ||
  getLocation.includes('/history/upgrade/')){
  ScanBarEgress();
}

hamburgerMenu('.panel-btn','.panel-menu','menu-responsive')