import { Controller } from "@/decorators/controller";
import { Roles } from "@/decorators/roles";
import { Get } from "@/decorators/routes";
import { dependencyTokens } from "@/dependencies/tokens";
import { IAnalyticsService } from "@/services";
import { IAnalytics, UserRole } from "@/types";
import { Request, Response } from "express";
import { inject } from "tsyringe";
import { BaseController } from "./BaseController";

/**
 * A controller that is responsible for handling analytics-related operations.
 */
@Controller("/analytics")
export class AnalyticsController extends BaseController {
    constructor(
        @inject(dependencyTokens.analyticsService)
        private readonly analyticsService: IAnalyticsService
    ) {
        super();
    }

    /**
     * Generates analytics in a given academic session and semester.
     *
     * @param req The request object.
     * @param res The response object.
     */
    @Get("/generate")
    @Roles(UserRole.lecturer)
    async generate(
        req: Request<
            "/generate",
            IAnalytics | { error: string },
            unknown,
            Partial<{ session: string; semester: string }>
        >,
        res: Response<IAnalytics | { error: string }>
    ) {
        const validatedSessionAndSemester = this.validateSessionSemester(
            req,
            res
        );

        if (!validatedSessionAndSemester) {
            return;
        }

        const { session, semester } = validatedSessionAndSemester;

        try {
            const result = await this.analyticsService.generate(
                session,
                semester
            );

            this.respondWithOperationResult(res, result);
        } catch (e) {
            console.error(e);

            res.status(500).json({ error: "Internal server error" });
        }
    }
}
