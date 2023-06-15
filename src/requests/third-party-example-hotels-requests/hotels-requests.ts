import {thirdPartyExample} from '../../utils';

export const fetchThirdPartyExampleHotels = async (
    skiSite: number,
    fromDate: string,
    toDate: string,
    groupSize: number
) => {
    try {
        const url = '/default/HotelsSimulator';
        const response = await thirdPartyExample.post(url, {
            query: {
                ski_site: skiSite,
                from_date: fromDate,
                to_date: toDate,
                group_size: groupSize,
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
