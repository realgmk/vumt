import React from 'react';
import {
    Container
} from 'reactstrap';
import { useTranslation } from 'react-i18next'
import VisitCheckedInDetail from './VisitCheckedInDetail';

export default function VisitDetail({visit}) {
    const { t, i18n } = useTranslation('visit')

    return <Container>
        <h1>{t('detailHeading')}</h1>
        <p>{t('translation:timesAreLocal',{timezone: visit.origin.timezone})}</p>
        <dl>
            <dt>{t('startOnDate')}</dt>
            <dd>{Intl.DateTimeFormat(i18n.language,{timeZone: visit.origin.timezone}).format(visit.startOn)}</dd>
            <dt>{t('startOnTime')}</dt>
            <dd>{(new Date(visit.startOn)).toLocaleTimeString(i18n.language,{timeZone: visit.origin.timezone})}</dd>
            <dt>{t('origin')}</dt>
            <dd>{visit.origin.name}</dd>
            <dt>{t('destinations')}</dt>
            <dd>{visit.destinations.map(d => d.name).join(', ')}</dd>
            <dt>{t('groupSize')}</dt>
            <dd>{visit.groupSize}</dd>
            <dt>{t('durationNights')}</dt>
            <dd>{visit.durationNights}</dd>
            <VisitCheckedInDetail visit={visit}/>
        </dl>
    </Container>
}
