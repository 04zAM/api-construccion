const { db } = require("../../cnn");

module.exports = resolvers = {
  Query: {
    async getTeam(root, { id }) {
      try {
        let teams = {};
        if (id == undefined) {
          teams = await db.any(
            `select * from teams where tea_state=true order by tea_id`
          );
        } else {
          teams = await db.any(
            `select * from teams where tea_id=$1 and tea_state=true`,
            [id]
          );
        }
        for (const key in teams) {
          if (Object.hasOwnProperty.call(teams, key)) {
            const team = teams[key];
            const team_leagues = await db.any(
              `select * from team_league where tea_id=$1 and tea_lea_state=true 
              order by tea_lea_id`,
              [team.tea_id]
            );
            for (const key in team_leagues) {
              if (Object.hasOwnProperty.call(team_leagues, key)) {
                const team_league = team_leagues[key];
                team.leagues = await db.any(
                  `select l.* from league l inner join team_league tl using(lea_id) 
                  where tea_lea_id=$1 and lea_state=true order by l.lea_id`,
                  [team_league.tea_lea_id]
                );
              }
            }
          }
        }
        return teams;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getLeague(root, { id }) {
      try {
        let leagues = {};
        if (id == undefined) {
          leagues = await db.any(
            `select * from league where lea_state=true order by lea_id`
          );
        } else {
          leagues = await db.any(
            `select * from league where lea_id=$1 and lea_state=true`,
            [id]
          );
        }
        for (const key in leagues) {
          if (Object.hasOwnProperty.call(leagues, key)) {
            const league = leagues[key];
            const team_leagues = await db.any(
              `select * from team_league where lea_id=$1 and tea_lea_state=true 
              order by tea_lea_id`,
              [league.lea_id]
            );
            for (const key in team_leagues) {
              if (Object.hasOwnProperty.call(team_leagues, key)) {
                const team_league = team_leagues[key];
                league.teams = await db.any(
                  `select t.* from teams t inner join team_league tl using(tea_id) 
                  where tea_lea_id=$1 and tea_state=true order by t.tea_id`,
                  [team_league.tea_lea_id]
                );
              }
            }
          }
        }
        return leagues;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getTeamLeague(root, { id }) {
      try {
        let teams_leagues = {};
        if (id == undefined) {
          teams_leagues = await db.any(
            `select * from team_league where tea_lea_state=true order by tea_lea_id`
          );
        } else {
          teams_leagues = await db.any(
            `select * from team_league where tea_lea_id=$1 and tea_lea_state=true`,
            [id]
          );
        }
        for (const key in teams_leagues) {
          if (Object.hasOwnProperty.call(teams_leagues, key)) {
            const team_league = teams_leagues[key];
            team_league.leagues = await db.any(
              `select t.* from teams t inner join team_league using(tea_id) 
              where tea_lea_id=$1 and tea_state=true order by t.tea_id`,
              [team_league.tea_lea_id]
            );
            team_league.teams = await db.any(
              `select l.* from league l inner join team_league using(lea_id) 
              where tea_lea_id=$1 and lea_state=true order by l.lea_id`,
              [team_league.tea_lea_id]
            );
          }
        }
        return teams_leagues;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    async setTeam(root, { team }) {
      try {
        return await db.one(
          `INSERT INTO teams(tea_name, tea_country, tea_fundation, tea_state)
          VALUES($1, $2, $3, true) returning *;`,
          [team.tea_name, team.tea_country, team.tea_fundation]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async updateTeam(root, { tea_id, team }) {
      try {
        return await db.one(
          `UPDATE teams SET tea_name=COALESCE($2, tea_name), 
          tea_country=COALESCE($3, tea_country), tea_fundation=COALESCE($4, tea_fundation)
          WHERE tea_id=$1 returning *;`,
          [tea_id, team?.tea_name, team?.tea_country, team?.tea_fundation]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async deleteTeam(root, { tea_id }) {
      try {
        return await db.one(
          `UPDATE teams SET tea_state=false WHERE tea_id=$1 returning *;`,
          [tea_id]
        );
      } catch (error) {
        console.log(error);
        return null;
        UPDATE;
      }
    },
    async setLeague(root, { league }) {
      try {
        return await db.one(
          `INSERT INTO league( lea_name, lea_country, lea_creation, lea_state)
          VALUES($1, $2, $3, true) returning *;`,
          [league.lea_name, league.lea_country, league.lea_creation]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async updateLeague(root, { lea_id, league }) {
      try {
        return await db.one(
          `UPDATE league SET lea_name=COALESCE($2, lea_name), 
          lea_country=COALESCE($3, lea_country), lea_creation=COALESCE($4, lea_creation)
          WHERE lea_id=$1 returning *;`,
          [lea_id, league?.lea_name, league?.lea_country, league?.lea_creation]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async deleteLeague(root, { lea_id }) {
      try {
        return await db.one(
          `UPDATE league SET lea_state=false WHERE lea_id=$1 returning *;`,
          [lea_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async setTeamLeague(root, { team_league }) {
      try {
        return await db.one(
          `INSERT INTO team_league(tea_id, lea_id, tea_lea_title, tea_lea_state)
          VALUES($1, $2, $3, true) returning *;`,
          [team_league.tea_id, team_league.lea_id, team_league.tea_lea_title]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async updateTeamLeague(root, { tea_lea_id, team_league }) {
      try {
        return await db.one(
          `UPDATE team_league SET tea_id=COALESCE($1, tea_id), 
          lea_id=COALESCE($2, lea_id), tea_lea_title=COALESCE($3, tea_lea_title) 
          WHERE tea_lea_id=$4 returning *;`,
          [
            team_league?.tea_id,
            team_league?.lea_id,
            team_league?.tea_lea_title,
            tea_lea_id,
          ]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async deleteTeamLeague(root, { tea_lea_id }) {
      try {
        return await db.one(
          `UPDATE team_league SET tea_lea_state=false 
          WHERE tea_lea_id=$1 returning *;`,
          [tea_lea_id]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};
