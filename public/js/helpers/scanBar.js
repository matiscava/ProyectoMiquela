export function getScan(id) {
  let $resultContainer = document.getElementById(id),
    $display = document.getElementById('qr-reader');
    let width = $display.clientWidth;
  let lastResult, countResults = 0;
  function onScanSuccess(decodedText, decodedResult) {
      if (decodedText !== lastResult) {
          ++countResults;
          lastResult = decodedText;
          // Handle on success condition with the decoded message.
          console.log(`Scan result ${decodedText}`, decodedResult);
        //   if (decodedResult = undefined) decodedResult = '';
          $resultContainer.querySelector('.qr-result').textContent = '';
          $resultContainer.querySelector('.qr-result').textContent = `Resultado: ${decodedText}`;
          sessionStorage.barCode = decodedText;
      }
  }

  let html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader", { fps: 10, qrbox: width*0.75 });
  html5QrcodeScanner.render(onScanSuccess);
}

export function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete"
      || document.readyState === "interactive") {
      // call on next available tick
      setTimeout(fn, 1);
  } else {
      document.addEventListener("DOMContentLoaded", fn);
  }
}
