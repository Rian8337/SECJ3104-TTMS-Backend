import { ILecturer } from "@/database/schema";
import { ITimetable, ITimetableClash } from "@/types";
import { Request, Response } from "express";

/**
 * A controller that is responsible for handling lecturer-related operations.
 */
export interface ILecturerController {
    /**
     * Logins a lecturer into the system.
     *
     * @param req The request object.
     * @param res The response object.
     */
    login(
        req: Request<
            "/login",
            unknown,
            Partial<{ login: string; password: string }>
        >,
        res: Response<ILecturer | { error: string }>
    ): Promise<void>;

    /**
     * Logs out a lecturer from the system.
     *
     * @param req The request object.
     * @param res The response object.
     */
    logout(req: Request<"/logout">, res: Response): void;

    /**
     * Obtains a lecturer's timetable by their worker number.
     *
     * @param req The request object.
     * @param res The response object.
     */
    getTimetable(
        req: Request<
            "/timetable",
            unknown,
            unknown,
            Partial<{ session: string; semester: string; worker_no: string }>
        >,
        res: Response<ITimetable[] | { error: string }>
    ): Promise<void>;

    /**
     * Obtains the timetables that clash with a lecturer's timetable.
     *
     * @param req The request object.
     * @param res The response object.
     */
    getClashingTimetable(
        req: Request<
            "/clashing-timetable",
            unknown,
            unknown,
            Partial<{ session: string; semester: string; worker_no: string }>
        >,
        res: Response<ITimetableClash[] | { error: string }>
    ): Promise<void>;
}
