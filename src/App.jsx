import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import PulsaPurchase from './components/pulsa/PulsaPurchase';
import ElectricityForm from './components/PLN/ElectricityForm';
import PaymentSelection from './components/PLN/PaymentSelection';
import PaymentConfirmation from './components/PLN/PaymentConfirmation';
// import ProcessPayment from './components/pulsa/ProcessPayment';
import PaymentProcess from './components/PLN/PaymentProcess';
// import KirimUang from './components/KirimUang/KirimUang';
// import ProsesPengiriman from './components/KirimUang/ProsesPengiriman';
// import Dana from './components/TopUp/Dana/Dana';
// import PaymentPage from './components/TopUp/Dana/PaymentPage';
// import ConfirmationPage from './components/TopUp/Dana/ConfirmationPage';
// import Process from './components/TopUp/Dana/Process';
// // import Gopay from './components/TopUp/Gopay/Gopay';
// import LinkAja from './components/TopUp/LinkAja/LinkAja';
// import Ovo from './components/TopUp/Ovo/Ovo';
// import Header from './components/Header';
// import MetodePayment from './components/NextPage/MetodePayment';
// import Footer from './components/Footer';
// // PaketBicara
// import PaketPage from './components/PaketBicara/PaketPage';
// import MetodePembayaranPaket from './components/PaketBicara/PaketInputNumber';
// // PaketRoaming
// import PaketRoaming from './components/PaketRoaming/PaketPage';
// // voucher_gaming
// import VoucherGaming from './components/VoucherGaming/PaketPage';
// E_walletsaldo
// import E_walletsaldo from './components/Ewallet/PaketPage';
// Emoney
// import Emoney from './components/Emoney/PaketPage';
// TV
// import TV from './components/TV/PaketPage';
// PulsaRevisi
import PulsaPage from './components/PulsaRevisi/PulsaPage';
import MetodePembayaranPulsa from './components/PulsaRevisi/MetodePembayaranPulsa';
import Login from './pages/auth/Login'
// Kuota
import Kuota from './components/Kuota/KuotaPage';
import MetodePembayaranKuota from './components/Kuota/MetodePembayaranKuota';
import ConfirmationKuota from './components/Kuota/ConfirmationKuota';

import AllCategories from './components/AllCategories';
import ProductList from './components/TransactionModal';
import SubCategoryPage from './components/SubCategoryPage';

  const App = () => {
    return (
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* <Header /> */}
          <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/category/:id" element={<CategoryPage />} /> */}
            {/* <Route path="/pulsa" element={<PulsaPurchase />} /> */}
            {/* <Route path="/pulsa" element={<PulsaPurchase />} /> */}
            <Route path="/pln" element={<ElectricityForm />} />
            <Route path="/electricity-form" element={<ElectricityForm />} />
            <Route path="/payment-selection" element={<PaymentSelection />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/payment-process" element={<PaymentProcess />} />
            {/* <Route path="/kirim-uang" element={<KirimUang />} /> */}
            {/* <Route path="/proses-pengiriman" element={<ProsesPengiriman />} /> */}
            {/* <Route path="/process-payment" element={<ProcessPayment />} /> */}
            {/* <Route path="/dana" element={<Dana />} /> */}
            {/* <Route path="/payment-page" element={<PaymentPage />} /> */}
            {/* <Route path="/confirmation" element={<ConfirmationPage />} /> */}
            {/* <Route path="/process" element={<Process />} /> */}
            {/* <Route path="/gopay" element={<Gopay />} /> */}
             {/* Kuota */}
             {/* <Route path="/kuota" element={<Kuota />} /> */}
            <Route path="/metode-pembayaran-kuota" element={<MetodePembayaranKuota />} />
            <Route path="/confirmation-kuota1" element={<ConfirmationKuota />} />
            {/* PulsaRevisi */}
            <Route path="/topup-pulsa" element={<PulsaPage />} />
            <Route path="/metode-pembayaran-pulsa" element={<MetodePembayaranPulsa />} />
            {/* PaketBicara */}
            {/* <Route path="/paket_bicara" element={<PaketPage />} /> */}
            <Route path="/metode-pembayaran-paket_bicara" element={<MetodePembayaranPulsa />} />
            {/* PaketBicara */}
            {/* <Route path="/paket_roaming" element={<PaketRoaming />} /> */}
            {/* voucher_gaming */}
            {/* <Route path="/voucher_gaming" element={<VoucherGaming />} /> */}
            {/* e_walletsaldo*/}
            {/* <Route path="/e_walletsaldo" element={<E_walletsaldo />} /> */}
            {/* Emoney */}
            {/* <Route path="/emoney" element={<Emoney />} /> */}
            {/* TV */}
            {/* <Route path="/tv" element={<TV />} /> */}

            {/* <Route exact path="/" component={Home} /> */}

        {/* Route for displaying subcategories */}
        <Route exact path="/category/:categoryId" component={ProductList} />

        {/* Route for displaying products */}
        <Route exact path="/categories/:categoryId/subcategories/:subCategoryId" component={ProductList} />
        <Route path="/subcategory/:categoryId" element={<SubCategoryPage />} />
            {/* <Route path="/metode-payment/:paymentType" element={<MetodePayment />} /> */}
            {/* <Route path="/linkaja" element={<LinkAja />} /> */}
            {/* <Route path="/ovo" element={<Ovo />} /> */}
            <Route path="/login" element={<Login />} />
          </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    );
  }

  export default App;
