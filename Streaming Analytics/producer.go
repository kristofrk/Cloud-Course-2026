package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"math/rand"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/kinesis"
)

const (
	latitudeStart   = 40.749167
	longitudeStart  = -73.985184
	latitudeOffset  = 110540
	longitudeOffset = 111320
	pointsStart     = 150
	minDistance     = 29.0
	maxDistance     = 31.0
)

type unicornStatus struct {
	Distance     float64
	HealthPoints int
	Latitude     float64
	Longitude    float64
	MagicPoints  int
	Name         *string
	InputData    *string
	StatusTime   string
}

func main() {
	name := flag.String("name", "Shadowfax", "Unicorn Name")
	stream := flag.String("stream", "wildrydes", "Stream Name")
	errorFlag := flag.String("error", "no", "Flag to introduce a Error Record in the Stream")
	totalMsgs := flag.Int("msgs", 2000, "Flag to control the number of messages sent to the stream")

	flag.Parse()

	sess := session.Must(
		session.NewSessionWithOptions(
			session.Options{
				SharedConfigState: session.SharedConfigEnable,
			},
		),
	)

	simulateUnicorn(kinesis.New(sess), totalMsgs, name, stream, errorFlag)
}

func simulateUnicorn(client *kinesis.Kinesis, totalMsgs *int, name, stream, errorFlag *string) {
	rand.Seed(time.Now().UnixNano())

	magicPoints := pointsStart
	healthPoints := pointsStart
	latitude := latitudeStart
	longitude := longitudeStart
	bearing := rand.Float64() * math.Pi * 2
	ticker := time.NewTicker(time.Second)

	// Introducing a new ErrorFlag to create Data Quality error in the stream
	// A record with Name containing 'error' is treated as a Data Quality error.
	data := "Unicorn"
	count := 0

	errFlagLowerCase := strings.ToLower(*errorFlag)

	for range ticker.C {
		count++
		if count > *totalMsgs {
			os.Exit(0)
		}
		if strings.Compare(errFlagLowerCase, "yes") == 0 {
			if count%5 == 0 {
				data = "Unicorn" + "error"
			} else {
				data = "Unicorn"
			}
		}
		magicPoints = nextPoints(magicPoints)
		healthPoints = nextPoints(healthPoints)
		distance := float64(rand.Intn(maxDistance-minDistance)+minDistance) + rand.Float64()
		latitude, longitude = nextLocation(latitude, longitude, bearing, distance)
		status, _ := json.Marshal(
			&unicornStatus{
				Distance:     distance,
				HealthPoints: healthPoints,
				Latitude:     latitude,
				Longitude:    longitude,
				MagicPoints:  magicPoints,
				InputData:    &data,
				Name:         name,
				StatusTime:   time.Now().Format("2006-01-02 15:04:05.000"),
			},
		)
		putRecordInput := &kinesis.PutRecordInput{
			Data:         append([]byte(status), "\n"...),
			PartitionKey: name,
			StreamName:   stream,
		}

		if _, err := client.PutRecord(putRecordInput); err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		// fmt.Println("Input Data = " + data)
		// fmt.Println(putRecordInput)
		fmt.Print(".")
	}
}

func nextLocation(latitude, longitude, bearing float64, distance float64) (nextLatitude, nextLongitude float64) {
	nextLatitude = latitude + float64(distance)*math.Sin(bearing)/latitudeOffset
	nextLongitude = longitude + float64(distance)*math.Cos(bearing)/(longitudeOffset*math.Cos(math.Pi*latitude/180))

	return
}

func nextPoints(points int) int {
	y := rand.Intn(2)

	if rand.Int()%2 == 0 {
		y = y * -1
	}

	return points + y
}
