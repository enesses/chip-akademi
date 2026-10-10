import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import ChipDetail from "@/pages/ChipDetail";
import Hesap from "@/pages/Hesap";
import Learn from "@/pages/Learn";
import Lesson from "@/pages/Lesson";
import Prices from "@/pages/Prices";
import Bugun from "@/pages/Bugun";
import Otomasyon from "@/pages/Otomasyon";
import Glossary from "@/pages/Glossary";
import Notes from "@/pages/Notes";
import Exam from "@/pages/Exam";
import Design from "@/pages/Design";
import Designs from "@/pages/Designs";
import Compare from "@/pages/Compare";
import Ic from "@/pages/Ic";
import IcDetail from "@/pages/IcDetail";
import Haftalik from "@/pages/Haftalik";
import Promptlar from "@/pages/Promptlar";
import Haberler from "@/pages/Haberler";
import Skiller from "@/pages/Skiller";
import AramaPaleti from "@/components/nav/AramaPaleti";
import MobilMenu from "@/components/nav/MobilMenu";

/*
 * Uygulama tek dosyalık statik HTML olarak dağıtılıyor ve file:// ile
 * doğrudan açılabiliyor; bu durumda window.location.pathname sayfanın
 * "/" değil, diskteki tam dosya yoludur. Hash tabanlı yönlendirme bu
 * sorunu ortadan kaldırır: nereden açılırsa açılsın aynı çalışır.
 */
export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen flex flex-col alt-bosluk">
        <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground" onClick={(e) => { e.preventDefault(); document.getElementById("icerik")?.focus(); }}>İçeriğe geç</a>
        <Header />
        <main id="icerik" tabIndex={-1} className="flex-1 outline-none">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/kategori/:cat" component={Category} />
            <Route path="/chip/:id" component={ChipDetail} />
            <Route path="/hesap" component={Hesap} />
            <Route path="/egitim" component={Learn} />
            <Route path="/egitim/:id" component={Lesson} />
            <Route path="/fiyatlar" component={Prices} />
            <Route path="/bugun" component={Bugun} />
            <Route path="/haberler" component={Haberler} />
            <Route path="/otomasyon" component={Otomasyon} />
            <Route path="/haftalik" component={Haftalik} />
            <Route path="/ai/promptlar" component={Promptlar} />
            <Route path="/ai/skiller" component={Skiller} />
            <Route path="/ai" component={Promptlar} />
            <Route path="/sozluk" component={Glossary} />
            <Route path="/notlar" component={Notes} />
            <Route path="/sinav" component={Exam} />
            <Route path="/atolye" component={Designs} />
            <Route path="/tasarla/:id" component={Design} />
            <Route path="/tasarla" component={Design} />
            <Route path="/karsilastir" component={Compare} />
            <Route path="/ic/:id" component={IcDetail} />
            <Route path="/ic" component={Ic} />
            <Route>
              <div className="container mx-auto px-4 py-16 text-muted-foreground">
                Bu sayfa henüz yeniden kurulmadı.
              </div>
            </Route>
          </Switch>
        </main>
        <Footer />
        <MobilMenu />
        <AramaPaleti />
      </div>
    </Router>
  );
}
