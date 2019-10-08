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

def getUserInfor(connection, wechat):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        search_stmt = (
            "SELECT * FROM `user` WHERE `wechat`=%s"
        )
        data = (wechat)
        cursor.execute(search_stmt, data)
        cursor.close()
        result = cursor.fetchall()
        return len(result)
    except Exception as e:
        print("getUserInfor", e)
        return False

def addUseerInfor(connection, wechat,username,local,pic):
    try:
        connection.ping(reconnect=True)
        cursor = connection.cursor()
        insert_stmt = (
            "INSERT INTO user(`wechat`,`username`,`local`,`pic`) "
            "VALUES (%s,%s,%s,%s)"
        )
        data = (wechat,username,local,pic)
        cursor.execute(insert_stmt, data)
        cursor.close()
        connection.close()
        return True
    except Exception as e:
        print("addUseerInfor", e)
        return False


def main_handler(event, context):
    print(event)
    body = json.loads(event['body'])
    wechat = body['wechat']
    nickname = body['nickname']
    pic = body['pic']
    local = body['local']


    if getUserInfor(connection, wechat) == 0:
        if addUseerInfor(connection, wechat,nickname,local,pic):
            result = True
        else:
            result = False
    else:
        result = True

    return {
        "result": result
    }

