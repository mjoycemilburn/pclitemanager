
import { firebaseApp, db } from '../lib/firebase_config.js';
import { collection, getDocs, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { TESTING } from '../App';

//  SECTIONS = [ {dataObject: {sectionId: "about", sectionHeader: "About", sectionType: "standard_title", sectionPrefix: "", sectionSequenceNumber: "0" }, dataObjectId: YPQ123jk..L},]
//  ENTRIES = [ {dataObject:   { sectionId: "agendas", entryDate: "2017-05-02", entrySuffix: "AGM and Parish Mtg", entryTitle: "(AGM & Parish Mtg)", associatedFilename }, dataObjectId: ZY$hj123jk..P},]

const testSECTIONS = [
    { "sectionId": "about", "sectionHeader": "About", "sectionType": "standard_title", "sectionPrefix": "", "sectionSequenceNumber": 0 },
    { "sectionId": "minutes", "sectionHeader": "Minutes", "sectionType": "date_title", "sectionPrefix": "Minutes for", "sectionSequenceNumber": 1 },
    { "sectionId": "drafts", "sectionHeader": "Draft Minutes", "sectionType": "date_title", "sectionPrefix": "Draft Minutes for", "sectionSequenceNumber": 2 },
    { "sectionId": "agendas", "sectionHeader": "Agendas", "sectionType": "date_title", "sectionPrefix": "Agenda for ", "sectionSequenceNumber": 3 },
    { "sectionId": "finstats", "sectionHeader": "Financial Statements and Accounts", "sectionType": "date_title", "sectionPrefix": "Accounts for", "sectionSequenceNumber": 4 },
    { "sectionId": "policies", "sectionHeader": "Policies", "sectionType": "standard_title", "sectionPrefix": "", "sectionSequenceNumber": 5 },
    { "sectionId": "sundries", "sectionHeader": "Sundries", "sectionType": "standard_title", "sectionPrefix": "", "sectionSequenceNumber": 6 }
];

const testENTRIES = [
    { "sectionId": "about", "entryDate": "2000-01-01", "entrySuffix": "", "entryTitle": "About Milburn Parish Council", "associatedFilename": "about_About Milburn Parish Council.pdf" },
    { "sectionId": "agendas", "entryDate": "2022-05-03", "entrySuffix": "AGM and Parish Council", "entryTitle": "", "associatedFilename": "agendas_2022-05-03_AGM and Parish Council.pdf" },
    { "sectionId": "agendas", "entryDate": "2022-03-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2022-03-01_.pdf" },
    { "sectionId": "agendas", "entryDate": "2022-01-11", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2022-01-11_.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-11-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2021-11-02_.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-09-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2021-09-07_.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-07-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2021-07-06_.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-05-25", "entrySuffix": "AGM and Parish", "entryTitle": "", "associatedFilename": "agendas_2021-05-25_AGM and Parish.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-03-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2021-03-02_.pdf" },
    { "sectionId": "agendas", "entryDate": "2021-01-26", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2021-01-26_.pdf" },
    { "sectionId": "agendas", "entryDate": "2020-07-14", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2020-07-14_.pdf" },
    { "sectionId": "agendas", "entryDate": "2020-01-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2020-01-07_.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-11-12", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2019-11-12_.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-09-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2019-09-03_.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-07-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2019-07-02_.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-05-07", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "agendas_2019-05-07_AGM and Parish Mtg.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-03-05", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2019-03-05_.pdf" },
    { "sectionId": "agendas", "entryDate": "2019-01-08", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2019-01-08_.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-11-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2018-11-06_.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-09-04", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2018-09-04_.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-07-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2018-07-03_.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-05-08", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "agendas_2018-05-08_AGM and Parish Mtg.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-03-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2018-03-06_.pdf" },
    { "sectionId": "agendas", "entryDate": "2018-01-16", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2018-01-16_.pdf" },
    { "sectionId": "agendas", "entryDate": "2017-11-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2017-11-07_.pdf" },
    { "sectionId": "agendas", "entryDate": "2017-09-05", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2017-09-05_.pdf" },
    { "sectionId": "agendas", "entryDate": "2017-05-02", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "agendas_2017-05-02_AGM and Parish Mtg.pdf" },
    { "sectionId": "agendas", "entryDate": "2017-03-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2017-03-07_.pdf" },
    { "sectionId": "agendas", "entryDate": "2017-01-10", "entrySuffix": "", "entryTitle": "", "associatedFilename": "agendas_2017-01-10_.pdf" },
    { "sectionId": "drafts", "entryDate": "2022-05-03", "entrySuffix": "AGM", "entryTitle": "", "associatedFilename": "drafts_2022-05-03_AGM.pdf" },
    { "sectionId": "drafts", "entryDate": "2022-05-03", "entrySuffix": "Annual Parish Mtg", "entryTitle": "", "associatedFilename": "drafts_2022-05-03_Annual Parish Mtg.pdf" },
    { "sectionId": "finstats", "entryDate": "2021-03-31", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2021-03-31_.pdf" },
    { "sectionId": "finstats", "entryDate": "2020-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2020-01-01_.pdf" },
    { "sectionId": "finstats", "entryDate": "2019-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2019-01-01_.pdf" },
    { "sectionId": "finstats", "entryDate": "2018-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2018-01-01_.pdf" },
    { "sectionId": "finstats", "entryDate": "2017-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2017-01-01_.pdf" },
    { "sectionId": "finstats", "entryDate": "2016-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2016-01-01_.pdf" },
    { "sectionId": "finstats", "entryDate": "2015-01-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "finstats_2015-01-01_.pdf" },
    { "sectionId": "minutes", "entryDate": "2022-03-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2022-03-01_.pdf" },
    { "sectionId": "minutes", "entryDate": "2022-01-11", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2022-01-11_.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-11-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2021-11-02_.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-09-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2021-09-07_.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-07-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2021-07-06_.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-05-25", "entrySuffix": "AGM", "entryTitle": "", "associatedFilename": "minutes_2021-05-25_AGM.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-05-25", "entrySuffix": "Annual Parish Mtg", "entryTitle": "", "associatedFilename": "minutes_2021-05-25_Annual Parish Mtg.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-03-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2021-03-02_.pdf" },
    { "sectionId": "minutes", "entryDate": "2021-01-26", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2021-01-26_.pdf" },
    { "sectionId": "minutes", "entryDate": "2020-07-14", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2020-07-14_.pdf" },
    { "sectionId": "minutes", "entryDate": "2020-03-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2020-03-03_.pdf" },
    { "sectionId": "minutes", "entryDate": "2020-01-07", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2020-01-07_.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-11-12", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2019-11-12_.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-09-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2019-09-03_.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-07-02", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2019-07-02_.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-05-07", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "minutes_2019-05-07_AGM and Parish Mtg.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-03-05", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2019-03-05_.pdf" },
    { "sectionId": "minutes", "entryDate": "2019-01-08", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2019-01-08_.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-11-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2018-11-06_.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-09-04", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2018-09-04_.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-07-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2018-07-03_.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-05-08", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "minutes_2018-05-08_AGM and Parish Mtg.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-03-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2018-03-06_.pdf" },
    { "sectionId": "minutes", "entryDate": "2018-01-18", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2018-01-18_.pdf" },
    { "sectionId": "minutes", "entryDate": "2017-09-05", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2017-09-05_.pdf" },
    { "sectionId": "minutes", "entryDate": "2017-07-04", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2017-07-04_.pdf" },
    { "sectionId": "minutes", "entryDate": "2017-05-02", "entrySuffix": "AGM and Parish Mtg", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "minutes_2017-05-02_AGM and Parish Mtg.pdf" },
    { "sectionId": "minutes", "entryDate": "2017-03-17", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2017-03-17_.pdf" },
    { "sectionId": "minutes", "entryDate": "2017-01-10", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2017-01-10_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-11-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2016-11-01_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-09-06", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2016-09-06_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-07-05", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2016-07-05_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-05-03", "entrySuffix": "", "entryTitle": "(AGM & Parish Mtg)", "associatedFilename": "minutes_2016-05-03_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-03-01", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2016-03-01_.pdf" },
    { "sectionId": "minutes", "entryDate": "2016-01-12", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2016-01-12_.pdf" },
    { "sectionId": "minutes", "entryDate": "2015-11-03", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2015-11-03_.pdf" },
    { "sectionId": "minutes", "entryDate": "2015-09-08", "entrySuffix": "", "entryTitle": "", "associatedFilename": "minutes_2015-09-08_.pdf" },
    { "sectionId": "policies", "entryDate": "2020-08-09", "entrySuffix": "", "entryTitle": "Accessibility Statement Aug 2020", "associatedFilename": "policies_Accessibility Statement Aug 2020.pdf" },
    { "sectionId": "policies", "entryDate": "2019-05-02", "entrySuffix": "", "entryTitle": "Privacy Policy May 2019", "associatedFilename": "policies_Privacy Policy May 2019.pdf" },
    { "sectionId": "policies", "entryDate": "2019-05-01", "entrySuffix": "", "entryTitle": "Data Protection Policy May 2019", "associatedFilename": "policies_Data Protection Policy May 2019.pdf" },
    { "sectionId": "sundries", "entryDate": "2020-02-17", "entrySuffix": "", "entryTitle": "4. Milburn Fieldname Map", "associatedFilename": "sundries_4. Milburn Fieldname Map.pdf" },
    { "sectionId": "sundries", "entryDate": "2020-02-16", "entrySuffix": "", "entryTitle": "3. Milburn OS Map - 1900", "associatedFilename": "sundries_3. Milburn OS Map - 1900.pdf" },
    { "sectionId": "sundries", "entryDate": "2020-02-15", "entrySuffix": "", "entryTitle": "2. Milburn OS Map - 1859", "associatedFilename": "sundries_2. Milburn OS Map - 1859.pdf" },
    { "sectionId": "sundries", "entryDate": "2016-01-01", "entrySuffix": "", "entryTitle": "5. Aerial Photo of Milburn co WITTWOO", "associatedFilename": "sundries_5. Aerial Photo of Milburn co WITTWOO.pdf" },
    { "sectionId": "sundries", "entryDate": "1970-01-01", "entrySuffix": "", "entryTitle": "1. About Milburn Village", "associatedFilename": "sundries_1. About Milburn Village.pdf" }
];

async function ResetFirestoreCollectionsFromTestData() {

    // reset the Firestore series and entries collection from the built-in testSECTIONS and testENTRIES arrays 

    const sectionsCollRef = collection(db, "sections");
    const sectionsSnapshot = await getDocs(sectionsCollRef);
    sectionsSnapshot.forEach(async (sectionsDoc) => {
        await deleteDoc(sectionsDoc.ref);
    });

    const entriesCollRef = collection(db, "entries");
    const entriesSnapshot = await getDocs(entriesCollRef);
    entriesSnapshot.forEach(async (entriesDoc) => {
        await deleteDoc(entriesDoc.ref);
    });

    for (let i = 0; i < testSECTIONS.length; i++) {
        const sectionsDocRef = doc(sectionsCollRef);
        await setDoc(sectionsDocRef, testSECTIONS[i]);
    }

    for (let i = 0; i < testENTRIES.length; i++) {
        const entriesDocRef = doc(entriesCollRef);
        await setDoc(entriesDocRef, testENTRIES[i]);
    }

};

const ENTRIES = [];
const SECTIONS = [];

async function SetLocalCollectionCopies() {

    // Set the local copies of the current Firestore series and entries collections'

    // The Manage webapp uses a "virtual" database to manage its collections in the same way that
    // React uses a virtual DOM to manage the real version. The series and entries Firestore collections
    // are thus managed inside the webapp via internal arrays:
    //
    // Note that if your collections were enormous, you might still use this approach during initial
    // development because it saves so much time. When running from local test data you avoid
    // the need to deploy every time you want to try out some changes - testing changes through the
    // Rect server is soooo much quicker. The trick is then to concentrate your singleton updates
    // in a performDataCUD routine that switches on a "testing" variable to select the data target 
    // (local store or localstore + collection) so that your code doesn't need to be changed when you
    // come to switch to live operation. 
    //
    // If you thought that your live collection would be too large to fit in a local array,or
    // that creating it would put an unacceptable strain on your apps performance,  you 
    // would switch off maintenance of this in performDataCUD and generalise your forEach code
    // elsewhere with an arrangement that switched on the testing variable to construct an 
    // appropriate snapshot before continuing.

//  SECTIONS = [ {dataObject: {sectionId: "about", sectionHeader: "About", sectionType: "standard_title", sectionPrefix: "", sectionSequenceNumber: "0" }, dataObjectId: YPQ123jk..L},]
//  ENTRIES = [ {dataObject:   { sectionId: "agendas", entryDate: "2017-05-02", entrySuffix: "AGM and Parish Mtg", entryTitle: "(AGM & Parish Mtg)", associatedFilename }, dataObjectId: ZY$hj123jk..P},]

    if (TESTING) {

        // These arrays are initialised from from the built-in testSECTIONS and testENTRIES arrays 

        testSECTIONS.forEach((section, index) => {
            SECTIONS.push({ dataObject: section, dataObjectId: Math.random() })
        })
        testENTRIES.forEach((entry, index) => {
            ENTRIES.push({ dataObject: entry, dataObjectId: Math.random() });
        })

    } else {

        // These arrays are initialised from Firestore at login and are kept in synch with Firestore subsequently in the performCUD routine

        const sectionsCollRef = collection(db, "sections");
        const sectionsQuery = query(sectionsCollRef, orderBy("sectionSequenceNumber", "asc"));
        const sectionsSnapshot = await getDocs(sectionsQuery);
        sectionsSnapshot.forEach((sectionsDoc) => {
            SECTIONS.push({ dataObject: sectionsDoc.data(), dataObjectId: sectionsDoc.id });
        });
        const entriesCollRef = collection(db, "entries");
        const entriesQuery = query(entriesCollRef, orderBy("entryDate", "desc"));
        const entriesSnapshot = await getDocs(entriesQuery);
        entriesSnapshot.forEach((entriesDoc, index) => {
            ENTRIES.push({ dataObject: entriesDoc.data(), dataObjectId: entriesDoc.id });
        });
    }
};

export { SECTIONS, ENTRIES, SetLocalCollectionCopies, ResetFirestoreCollectionsFromTestData, firebaseApp, db };