import { Db } from 'mongodb'
import { computeTermAggregationByYear } from './generic'
import { SurveyConfig } from '../types'

export async function computeHappinessByYear(db: Db, survey: SurveyConfig, id: string) {
    const happinessByYear = await computeTermAggregationByYear(db, survey, `happiness.${id}`, {
        sort: 'id',
        order: 1
    })

    // compute mean for each year
    happinessByYear.forEach((bucket: any) => {
        const totalScore = bucket.buckets.reduce((acc: any, subBucket: any) => {
            return acc + subBucket.id * subBucket.count
        }, 0)
        bucket.mean = Math.round((totalScore / bucket.total) * 10) / 10 + 1
    })

    return happinessByYear
}
