import { Prop } from "@nestjs/mongoose";

export class TrainingsStatistics {
    @Prop({ required: true, default: 0 })
    learned_words: number;

    @Prop({ required: true, default: 0 })
    skipped_words: number;

    @Prop({ required: true, default: 0 })
    accuracy_rate: number;

    @Prop({ required: true })
    most_effective_training: string;

    @Prop({ required: true })
    least_successful_training: string;

    @Prop({ required: true, default: 0 })
    total_interrupted_trainings: number;

    @Prop({ required: true, default: 0 })
    trainings_completed: number;
}