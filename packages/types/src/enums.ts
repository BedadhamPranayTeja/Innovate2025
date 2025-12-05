export enum Phase {
    PRE = "PRE",
    LIVE = "LIVE",
    POST = "POST"
}

export enum Role {
    STUDENT = "student",
    JUDGE = "judge",
    ADMIN = "admin"
}

export enum TeamPrivacy {
    PUBLIC = "public",
    PRIVATE = "private"
}

export enum MemberStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

export enum PaymentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    FAILED = "failed"
}

export enum SubmissionStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    SCORED = "scored"
}
