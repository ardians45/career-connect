CREATE TABLE "career" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"riasec_types" text NOT NULL,
	"industry" text,
	"experience_level" text,
	"required_skills" jsonb,
	"education_requirement" text,
	"salary_range" jsonb,
	"job_growth_rate" integer,
	"popularity_score" integer DEFAULT 0,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counseling_session" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"student_id" text NOT NULL,
	"test_result_id" text,
	"session_date" timestamp NOT NULL,
	"notes" text,
	"recommendations" text,
	"follow_up_date" timestamp,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"riasec_types" text NOT NULL,
	"degree_level" text NOT NULL,
	"study_duration" integer,
	"average_tuition" integer,
	"job_outlook" text,
	"average_salary" integer,
	"popularity_score" integer DEFAULT 0,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major_career" (
	"major_id" text NOT NULL,
	"career_id" text NOT NULL,
	"relevance_score" integer DEFAULT 100,
	CONSTRAINT "major_career_major_id_career_id_pk" PRIMARY KEY("major_id","career_id")
);
--> statement-breakpoint
CREATE TABLE "saved_recommendation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"test_result_id" text,
	"recommendation_type" text NOT NULL,
	"recommendation_id" text NOT NULL,
	"notes" text,
	"saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_question" (
	"id" text PRIMARY KEY NOT NULL,
	"question_text" text NOT NULL,
	"category" varchar(1) NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_result" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"guest_session_id" text,
	"realistic_score" integer DEFAULT 0 NOT NULL,
	"investigative_score" integer DEFAULT 0 NOT NULL,
	"artistic_score" integer DEFAULT 0 NOT NULL,
	"social_score" integer DEFAULT 0 NOT NULL,
	"enterprising_score" integer DEFAULT 0 NOT NULL,
	"conventional_score" integer DEFAULT 0 NOT NULL,
	"dominant_type" varchar(1) NOT NULL,
	"secondary_type" varchar(1),
	"tertiary_type" varchar(1),
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"test_duration" integer,
	"total_questions" integer NOT NULL,
	"raw_answers" jsonb
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "school_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "grade" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'student' NOT NULL;--> statement-breakpoint
ALTER TABLE "counseling_session" ADD CONSTRAINT "counseling_session_teacher_id_user_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_session" ADD CONSTRAINT "counseling_session_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_session" ADD CONSTRAINT "counseling_session_test_result_id_test_result_id_fk" FOREIGN KEY ("test_result_id") REFERENCES "public"."test_result"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_career" ADD CONSTRAINT "major_career_major_id_major_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."major"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_career" ADD CONSTRAINT "major_career_career_id_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."career"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recommendation" ADD CONSTRAINT "saved_recommendation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_recommendation" ADD CONSTRAINT "saved_recommendation_test_result_id_test_result_id_fk" FOREIGN KEY ("test_result_id") REFERENCES "public"."test_result"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_result" ADD CONSTRAINT "test_result_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;