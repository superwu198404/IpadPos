export const createSql = [
	`create table if not exists userInfo (
		"userid" TEXT,
		"username" TEXT,
		"password" TEXT,
		"userphoto" TEXT,
		"realname" TEXT,
		"telephone" TEXT,
		"company" TEXT,
		"job_number" TEXT,
		"userstatus" TEXT,
		"role_id" TEXT,
		"role" TEXT
	)`,
	`create table if not exists userGrade (
		"userid" TEXT,
		"grade1" TEXT,
		"grade1" TEXT,
		"grade1" TEXT,
		"date_lr" TEXT,
		"ryid_lr" TEXT,
		"note" TEXT
	)`
}