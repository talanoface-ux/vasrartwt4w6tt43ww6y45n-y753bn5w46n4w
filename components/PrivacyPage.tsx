import React from 'react';
import { Page } from '../types';

interface PrivacyPageProps {
  navigate: (page: Page) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-slate-800 my-10 rounded-lg shadow-lg text-slate-300" dir="rtl">
      <h1 className="text-3xl font-bold mb-4 text-white">سیاست حفظ حریم خصوصی و شرایط استفاده</h1>
      <p className="text-slate-400 mb-6">آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>

      <div className="prose prose-invert max-w-none text-slate-300">
        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۱. مقدمه</h2>
        <p>
          به چت همراه هوش مصنوعی خوش آمدید. این برنامه به عنوان یک نمونه نمایشی و برای اهداف سرگرمی ارائه شده است. با استفاده از خدمات ما، شما با این شرایط و سیاست‌های حفظ حریم خصوصی ما موافقت می‌کنید.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۲. داده‌هایی که جمع‌آوری می‌کنیم</h2>
        <p>
          ما به حریم خصوصی شما متعهد هستیم. این برنامه با رویکرد اولویت-حریم-خصوصی طراحی شده است.
        </p>
        <ul>
          <li><strong>عدم ذخیره‌سازی اطلاعات شخصی:</strong> به طور پیش‌فرض، ما مکالمات شما را روی سرورهای خود ذخیره نمی‌کنیم. تاریخچه چت شما مستقیماً در حافظه محلی (Local Storage) مرورگر شما ذخیره می‌شود.</li>
          <li><strong>ثبت‌نام اختیاری:</strong> اگر تصمیم به ایجاد حساب کاربری بگیرید (قابلیتی که در حال حاضر نمایشی است)، ما یک آدرس ایمیل برای احراز هویت جمع‌آوری خواهیم کرد.</li>
          <li><strong>تحلیل‌ها:</strong> ممکن است داده‌های استفاده ناشناس را برای بهبود برنامه جمع‌آوری کنیم.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۳. چگونه از داده‌های شما استفاده می‌کنیم</h2>
        <p>
          داده‌های ذخیره شده در مرورگر شما تنها به منظور ادامه مکالمات شما در جلسات مختلف استفاده می‌شود. اگر داده‌ای جمع‌آوری کنیم، برای بهره‌برداری و بهبود خدمات است. ما داده‌های شما را نمی‌فروشیم.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۴. مسئولیت‌های شما</h2>
        <ul>
            <li>برای استفاده از این سرویس باید ۱۸ سال یا بیشتر داشته باشید.</li>
            <li>این سرویس جایگزین خدمات حرفه‌ای سلامت روان نیست و تنها برای حمایت عاطفی و سرگرمی است.</li>
            <li>از به اشتراک گذاشتن اطلاعات شخصی حساس (آدرس، اطلاعات مالی و غیره) در چت خودداری کنید.</li>
            <li>شما موافقت می‌کنید که از این سرویس برای هیچ فعالیت غیرقانونی یا مضری استفاده نکنید.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۵. حذف داده‌ها</h2>
        <p>
          شما می‌توانید در هر زمان با شروع یک "چت جدید" یا با پاک کردن حافظه محلی مرورگر خود برای این سایت، تاریخچه چت خود را پاک کنید.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-2 text-white">۶. تغییرات در این سیاست</h2>
        <p>
          ما ممکن است هر از چند گاهی این سیاست را به‌روزرسانی کنیم. ما شما را از هرگونه تغییر با ارسال سیاست جدید در این صفحه مطلع خواهیم کرد.
        </p>
      </div>

      <button
        onClick={() => navigate('landing')}
        className="mt-8 px-6 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition"
      >
        بازگشت به صفحه اصلی
      </button>
    </div>
  );
};

export default PrivacyPage;