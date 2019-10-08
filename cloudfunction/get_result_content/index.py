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


def getEvaluateList(connection, rid):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "SELECT * FROM evaluate WHERE eid=(SELECT evaluate FROM `result` WHERE rid=%s)"
        )
        data = (rid)
        cursor.execute(search_stmt, data)
        cursor.close()
        try:
            result = cursor.fetchall()[0]
        except:
            result = "暂无数据，请稍后再试"
        return {"content": result["content"]}

    except Exception as e:
        print("getEvaluateList", e)
        return {}


def main_handler(event, context):
    print(event)

    body = json.loads(event['body'])
    rid = body['result']

    return {
        "result": getEvaluateList(connection, rid)
    }
