'use client';

import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('contact');
  const commonT = useTranslations('common');

  return (
    <div className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors duration-500 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-center mb-8 text-green-800 dark:text-white">
            {t('pageTitle')} <span className="text-orange-600">{t('pageTitleHighlight')}</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Form Section */}
            <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-black mb-6 text-secondary-dark">{t('getInTouch')}</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-black mb-2">{t('form.fullName')}</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('form.fullNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.email')}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.phone')}</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('form.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.subject')}</label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">{t('form.subjectPlaceholder')}</option>
                    <option value="sales">{t('subjects.sales')}</option>
                    <option value="support">{t('subjects.support')}</option>
                    <option value="parts">{t('subjects.parts')}</option>
                    <option value="service">{t('subjects.service')}</option>
                    <option value="other">{t('subjects.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('form.message')}</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('form.messagePlaceholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  {t('form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-8">
              <div className="bg-green-50 dark:bg-neutral-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-black mb-6 text-secondary-dark dark:text-white">{t('contactInfo')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-gray-200 rounded-full flex items-center justify-center">📍</div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('info.address')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info.addressLine1')}<br />
                        {t('info.addressLine2')}<br />
                        {t('info.addressLine3')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">📞</div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('info.phone')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info.phoneMain')}<br />
                        {t('info.phoneSupport')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-50 text-gray-200 rounded-full flex items-center justify-center">✉️</div>
                    <div>
                      <h3 className="font-semibold mb-1">{t('info.email')}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {t('info.emailSales')}<br />
                        {t('info.emailSupport')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-black mb-6 text-orange-600">{t('businessHours')}</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{t('hours.weekdays')}</span>
                    <span className="font-semibold dark:text-white">{t('hours.weekdaysTime')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{t('hours.saturday')}</span>
                    <span className="font-semibold dark:text-white">{t('hours.saturdayTime')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{t('hours.sunday')}</span>
                    <span className="font-semibold dark:text-white">{t('hours.sundayTime')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{t('hours.emergency')}</span>
                    <span className="font-semibold text-primary">{t('hours.emergencyStatus')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-black mb-3 text-secondary-dark dark:text-white">{t('needAssistance')}</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  {t('assistanceText')}
                </p>
                <button className="bg-orange-500 text-white font-black py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors">
                  {t('callEmergency')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}