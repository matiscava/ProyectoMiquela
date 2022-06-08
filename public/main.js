import { ClientTable } from "./js/ClientTable.js";
import { HistoryEgress } from "./js/HistoryEgress.js";
import { HistoryIngress } from "./js/HistoryIngress.js";
import { HistoryTable } from "./js/HistoryTable.js";
import { NewClientForm } from "./js/NewClientForm.js";
import { NewProductForm } from "./js/NewProductForm.js";
import { ProductTable } from "./js/ProductTable.js";
import { SignupForm } from "./js/SignupForm.js";

document.addEventListener('DOMContentLoaded', (e) => {
  let getLocation = window.location.pathname;
  if(getLocation === '/clients'){
    ClientTable();
  }
  if(getLocation === '/clients/new-client'){
    NewClientForm();
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
  if(getLocation === '/products'){
    ProductTable();
  }
  if(getLocation === '/products/new-product'){
    NewProductForm();
  }
  if(getLocation === '/users/signup'){
    SignupForm();
  } 
})