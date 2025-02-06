import mongoose from "mongoose";
import {increasingSequence} from "~/server/utils/increasingSequence";
import {Report} from "~/server/models/types/report";

const ReportSchema
    = new mongoose.Schema<Report>(
    {
        reportId: {type: Number, unique: true},
        reason: {type: String, default: '', maxlength: 1007},
        type: {type: String, default: ''},
        status: {type: Number, default: 0}
    },
    {timestamps: {createdAt: 'created', updatedAt: 'updated'}}
)

ReportSchema.pre('save', increasingSequence('reportId'))

export const ReportModel
    = mongoose.model<Report>('report', ReportSchema)