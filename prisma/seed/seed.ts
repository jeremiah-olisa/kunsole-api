import { InitialiseClient } from "src/common/prisma/prisma.client";
import { seedPlans } from "./plan.seeder";

const seed = async () => {
    InitialiseClient();

    await seedPlans();
};
seed()


