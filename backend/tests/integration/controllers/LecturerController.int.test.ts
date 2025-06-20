import {
    app,
    loginLecturer,
    loginStudent,
    seededPrimaryData,
} from "@test/setup";
import request from "supertest";

describe("LecturerController (integration)", () => {
    let agent: ReturnType<typeof request.agent>;

    beforeEach(() => {
        agent = request.agent(app);
    });

    describe("GET /lecturer/timetable", () => {
        const endpoint = "/lecturer/timetable";

        describe("Authentication", () => {
            it("Should return 401 if not authenticated", async () => {
                const res = await agent.get(endpoint);

                expect(res.status).toBe(401);
                expect(res.body).toEqual({ error: "Unauthorized" });
            });

            it("Should not return 401 for student requests", async () => {
                await loginStudent(agent);

                const res = await agent.get(endpoint);

                expect(res.status).not.toBe(401);
            });

            it("Should not return 401 for lecturer requests", async () => {
                await loginLecturer(agent);

                const res = await agent.get(endpoint);

                expect(res.status).not.toBe(401);
            });
        });

        describe("Response", () => {
            const session = seededPrimaryData.sessions[0];
            const lecturer = seededPrimaryData.lecturers[0];

            beforeEach(async () => {
                await loginLecturer(agent);
            });

            it("Should return 400 if session is missing", async () => {
                const res = await agent.get(endpoint).query({
                    semester: session.semester,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Academic session is required.",
                });
            });

            it("Should return 400 if semester is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Semester is required.",
                });
            });

            it("Should return 400 if worker_no is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Worker number is required.",
                });
            });

            it("Should return 400 if worker_no is not a number", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    worker_no: "abcde",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid worker number format.",
                });
            });

            it("Should return 400 if session format is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: "2023-2024",
                    semester: session.semester,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid session format. Expected format: YYYY/YYYY.",
                });
            });

            it("Should return 400 if semester is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: "4",
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid semester format. Expected format: 1, 2, or 3.",
                });
            });

            it("Should return timetable if all parameters are valid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(200);
                expect(res.body).toEqual([]);
            });
        });
    });

    describe("GET /lecturer/venue-clash", () => {
        const endpoint = "/lecturer/venue-clash";

        describe("Authentication", () => {
            it("Should return 401 if not authenticated", async () => {
                const res = await agent.get(endpoint);

                expect(res.status).toBe(401);
                expect(res.body).toEqual({ error: "Unauthorized" });
            });

            it("Should return 403 for student requests", async () => {
                await loginStudent(agent);

                const res = await agent.get(endpoint);

                expect(res.status).toBe(403);
                expect(res.body).toEqual({ error: "Forbidden" });
            });

            it("Should not return 401 for lecturer requests", async () => {
                await loginLecturer(agent);

                const res = await agent.get(endpoint);

                expect(res.status).not.toBe(401);
            });
        });

        describe("Response", () => {
            const session = seededPrimaryData.sessions[0];
            const lecturer = seededPrimaryData.lecturers[0];

            beforeEach(async () => {
                await loginLecturer(agent);
            });

            it("Should return 400 if session is missing", async () => {
                const res = await agent.get(endpoint).query({
                    semester: session.semester,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Academic session is required.",
                });
            });

            it("Should return 400 if semester is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Semester is required.",
                });
            });

            it("Should return 400 if worker_no is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Worker number is required.",
                });
            });

            it("Should return 400 if worker_no is not a number", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    worker_no: "abcde",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid worker number format.",
                });
            });

            it("Should return 400 if session format is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: "2023-2024",
                    semester: session.semester,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid session format. Expected format: YYYY/YYYY.",
                });
            });

            it("Should return 400 if semester is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: "4",
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid semester format. Expected format: 1, 2, or 3.",
                });
            });

            it("Should return venue clash data if all parameters are valid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    worker_no: lecturer.workerNo.toString(),
                });

                expect(res.status).toBe(200);
                expect(res.body).toEqual([]);
            });
        });
    });

    describe("GET /lecturer/search", () => {
        const endpoint = "/lecturer/search";

        describe("Authentication", () => {
            it("Should return 401 if not authenticated", async () => {
                const res = await agent.get(endpoint);

                expect(res.status).toBe(401);
                expect(res.body).toEqual({ error: "Unauthorized" });
            });

            it("Should not return 401 for student requests", async () => {
                await loginStudent(agent);

                const res = await agent.get(endpoint);

                expect(res.status).not.toBe(401);
            });

            it("Should not return 401 for lecturer requests", async () => {
                await loginLecturer(agent);

                const res = await agent.get(endpoint);

                expect(res.status).not.toBe(401);
            });
        });

        describe("Response", () => {
            const session = seededPrimaryData.sessions[0];
            const lecturer = seededPrimaryData.lecturers[0];

            beforeEach(async () => {
                await loginLecturer(agent);
            });

            it("Should return 400 if session is missing", async () => {
                const res = await agent.get(endpoint).query({
                    semester: session.semester,
                    query: "John",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Academic session is required.",
                });
            });

            it("Should return 400 if semester is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    query: "John",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Semester is required.",
                });
            });

            it("Should return 400 if query is missing", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Query is required.",
                });
            });

            it("Should return 400 if session format is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: "2023-2024",
                    semester: session.semester,
                    query: "John",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid session format. Expected format: YYYY/YYYY.",
                });
            });

            it("Should return 400 if semester is invalid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: "4",
                    query: "John",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid semester format. Expected format: 1, 2, or 3.",
                });
            });

            it("Should return 400 if limit is not a number", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    query: "John",
                    limit: "not-a-number",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid limit",
                });
            });

            it("Should return 400 if limit is less than 1", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    query: "John",
                    limit: "-1",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid limit",
                });
            });

            it("Should return 400 if offset is not a number", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    query: "John",
                    offset: "not-a-number",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid offset",
                });
            });

            it("Should return 400 if offset is less than 0", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    query: "John",
                    offset: "-1",
                });

                expect(res.status).toBe(400);
                expect(res.body).toEqual({
                    error: "Invalid offset",
                });
            });

            it("Should return lecturer search results if all parameters are valid", async () => {
                const res = await agent.get(endpoint).query({
                    session: session.session,
                    semester: session.semester,
                    query: lecturer.name.split(" ")[0],
                });

                expect(res.status).toBe(200);
                expect(res.body).toEqual([]);
            });
        });
    });
});
