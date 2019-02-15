import * as _ from 'lodash';
import * as SimpleGit from 'simple-git';

const Transifex = require('transifex');
const fs = require('fs');
const git = SimpleGit();


const gateway = new Transifex({ credential: 'api:<token>' });

interface Resource {
  project: string;
  slug: string;
  folder: string;
}

const locales: string[] = [
  'da-DK',
  'de-DE',
  'en-GB',
  'es-ES', 'es-MX',
  'fi-FI',
  'fr-CA', 'fr-FR',
  'it-IT',
  'nl', 'nl-NL',
  'pt-BR', 'pt-PT',
  'sv-SE',
  'th-TH',
];
const localeMapping: { [key: string]: string[] } = {
  'da-DK': ['da'],
  'de-DE': ['de'],
  'en-GB': ['en-AU', 'en-NZ', 'en-ZA'],
  'en-US': ['en', 'en-CA'],
  'es-MX': ['es'],
  'fi-FI': ['fi'],
  'fr-FR': ['fr'],
  'it-IT': ['it'],
  'pt-PT': ['pt'],
  'sv-SE': ['sv'],
  'th-TH': ['th'],
};
const resources: Resource[] = [
  { project: 'backend_notifications', slug: 'notification_textjson_en_usjson', folder: 'notifications' },
  { project: 'backend_document_labels', slug: 'en-usjson', folder: 'contentstore' },
];

function downloadResource(resource: Resource, locale: string) {
  gateway.translationInstanceMethod(resource.project, resource.slug, locale, function(err: any, data: any) {
    if (err) {
      console.error(`Failed downloading ${resource.project} ${resource.slug} ${locale}.json`);
      return;
    }

    const currentFileName = `${resource.folder}/${locale}.json`;
    console.log(`Writing ${resource.project} ${resource.slug} ${locale}.json -> ${currentFileName}`);

    const currentData = fs.existsSync(currentFileName) ? JSON.parse(fs.readFileSync(currentFileName)) : null;
    const updatedData = currentData ? _.merge(currentData, JSON.parse(data)) : JSON.parse(data);

    fs.writeFileSync(currentFileName, JSON.stringify(updatedData, null, 2));

    (localeMapping[locale] || []).forEach((mapping: string) => {
      const mappingFileName = `${resource.folder}/${mapping}.json`;
      console.log(`Copying ${resource.project} ${resource.slug} ${locale}.json -> ${mappingFileName}`);

      const mappingData = fs.existsSync(mappingFileName) ? JSON.parse(fs.readFileSync(mappingFileName)) : null;

      if (resource.folder === 'contentstore' && mappingData && mappingData.locale) {
        updatedData.locale = mappingData.locale;
      }
      fs.writeFileSync(mappingFileName, JSON.stringify(updatedData, null, 2));
    });
  });
}

resources.forEach((resource: Resource) =>
  locales.forEach((locale: string) =>
    downloadResource(resource, locale)));