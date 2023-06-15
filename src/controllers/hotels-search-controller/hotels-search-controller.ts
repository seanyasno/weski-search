import {EventEmitter} from 'events';
import {fetchThirdPartyExampleHotels} from '../../requests';
import _ from 'lodash';

const clientsDataMap = new Map();

export const getHotels = async (request, response) => {
    const { skiSite, fromDate, toDate, groupSize } = request.query;
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    const eventEmitter = new EventEmitter();
    clientsDataMap.set(response, eventEmitter);

    const lastData  = clientsDataMap.get(response);
    if (lastData) {
        response.write(`data: ${JSON.stringify(lastData)}\n\n`);
    }

    try {
        const firstRequest = fetchThirdPartyExampleHotels(Number(skiSite), fromDate.toString(), toDate.toString(), Number(groupSize));
        const secondRequest = fetchThirdPartyExampleHotels(Number(skiSite), fromDate.toString(), toDate.toString(), Number(groupSize)+1);
        const thirdRequest = fetchThirdPartyExampleHotels(Number(skiSite), fromDate.toString(), toDate.toString(), Number(groupSize)+2);

        Promise.race([firstRequest, secondRequest, thirdRequest]).then(fastestResponse => {
            eventEmitter.emit('update', fastestResponse.body.accommodations);
        });

        Promise.all([firstRequest, secondRequest, thirdRequest]).then(([firstResponse, secondResponse, thirdResponse]) => {
            const allData = _.uniq([
                ...(firstResponse.body.accommodations ?? []),
                ...(secondResponse.body.accommodations ?? []),
                ...(thirdResponse.body.accommodations ?? [])
            ]).sort((a, b) => a.PricesInfo.AmountBeforeTax - b.PricesInfo.AmountBeforeTax);
            eventEmitter.emit('update', allData);
        });
    } catch (error) {
        console.error(error);
        response.sendStatus(500);
    }

    const updateListener = (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`);
    }
    eventEmitter.on('update', updateListener);

    response.on('close', () => {
        eventEmitter.off('update', updateListener);
        clientsDataMap.delete(response);
        response.end();
    })


}
