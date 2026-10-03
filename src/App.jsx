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

/*
 * Uygulama tek dosyalık statik HTML olarak dağıtılıyor ve file:// ile
 * doğrudan açılabiliyor; bu durumda window.location.pathname sayfanın
 * "/" değil, diskteki tam dosya yoludur. Hash tabanlı yönlendirme bu
 * sorunu ortadan kaldırır: nereden açılırsa açılsın aynı çalışır.
 */
export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/kategori/:cat" component={Category} />
            <Route path="/chip/:id" component={ChipDetail} />
            <Route path="/hesap" component={Hesap} />
            <Route path="/egitim" component={Learn} />
            <Route path="/egitim/:id" component={Lesson} />
            <Route path="/fiyatlar" component={Prices} />
            <Route path="/bugun" component={Bugun} />
            <Route path="/otomasyon" component={Otomasyon} />
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
      </div>
    </Router>
  );
}
