# -*- coding: utf8 -*-

import pymysql
import json

connection = pymysql.connect(host="mysql-host",
                             user="root",
                             password="mysql-password",
                             port=int(62580),
                             db="iceshi",
                             charset='utf8',
                             cursorclass=pymysql.cursors.DictCursor,
                             autocommit=1)


def getEvaluateList(connection, score, test, user):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "INSERT INTO `result` (`rid`, `user`, `test`, `evaluate`, `remark`, `date`) VALUES "
            "(NULL, (SELECT uid FROM `user` WHERE wechat=%s), %s, (SELECT eid FROM `evaluate` "
            "WHERE %s>=score_min and %s<=score_max and test=%s), '', CURRENT_TIMESTAMP);"
        )
        data = (user, test, score, score, test)
        cursor.execute(search_stmt, data)
        cursor.close()
        result = cursor.lastrowid
        return {"rid": result}

    except Exception as e:
        print("getEvaluateList", e)
        return {}


def main_handler(event, context):
    print(event)

    body = json.loads(event['body'])
    test = body['test']
    score = body['score']
    user = body['user']

    return {
        "result": getEvaluateList(connection, score, test, user)
    }
