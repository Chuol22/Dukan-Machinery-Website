import { getRequestConfig } from 'next-intl/server';
import enCommon from '../i18n/messages/en/common.json';
import enHome from '../i18n/messages/en/home.json';
import enMachines from '../i18n/messages/en/machines.json';
import enContact from '../i18n/messages/en/contact.json';
import enOrder from '../i18n/messages/en/order.json';
import enProcess from '../i18n/messages/en/process.json';
import enTestimonials from '../i18n/messages/en/testimonials.json';
import enInsights from '../i18n/messages/en/insights.json';
import enBlog from '../i18n/messages/en/blog.json';
import enChatbot from '../i18n/messages/en/chatbot.json';
import enUi from '../i18n/messages/en/ui.json';

import amCommon from '../i18n/messages/am/common.json';
import amHome from '../i18n/messages/am/home.json';
import amMachines from '../i18n/messages/am/machines.json';
import amContact from '../i18n/messages/am/contact.json';
import amOrder from '../i18n/messages/am/order.json';
import amProcess from '../i18n/messages/am/process.json';
import amTestimonials from '../i18n/messages/am/testimonials.json';
import amInsights from '../i18n/messages/am/insights.json';
import amBlog from '../i18n/messages/am/blog.json';
import amChatbot from '../i18n/messages/am/chatbot.json';
import amUi from '../i18n/messages/am/ui.json';

import omCommon from '../i18n/messages/om/common.json';
import omHome from '../i18n/messages/om/home.json';
import omMachines from '../i18n/messages/om/machines.json';
import omContact from '../i18n/messages/om/contact.json';
import omOrder from '../i18n/messages/om/order.json';
import omProcess from '../i18n/messages/om/process.json';
import omTestimonials from '../i18n/messages/om/testimonials.json';
import omInsights from '../i18n/messages/om/insights.json';
import omBlog from '../i18n/messages/om/blog.json';
import omChatbot from '../i18n/messages/om/chatbot.json';
import omUi from '../i18n/messages/om/ui.json';

const messages = {
  en: {
    ...enCommon,
    ...enHome,
    ...enMachines,
    ...enContact,
    ...enOrder,
    ...enProcess,
    ...enTestimonials,
    ...enInsights,
    ...enBlog,
    ...enChatbot,
    ...enUi,
  },
  am: {
    ...amCommon,
    ...amHome,
    ...amMachines,
    ...amContact,
    ...amOrder,
    ...amProcess,
    ...amTestimonials,
    ...amInsights,
    ...amBlog,
    ...amChatbot,
    ...amUi,
  },
  om: {
    ...omCommon,
    ...omHome,
    ...omMachines,
    ...omContact,
    ...omOrder,
    ...omProcess,
    ...omTestimonials,
    ...omInsights,
    ...omBlog,
    ...omChatbot,
    ...omUi,
  },
};

export default getRequestConfig(async ({ locale }) => ({
  messages: messages[locale as keyof typeof messages] || messages.en
}));